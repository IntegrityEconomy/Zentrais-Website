'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DebateTopic, DebatePost, User } from '@/lib/types/debate';
import { topicsAPI, postsAPI, votesAPI, getCurrentUser } from '@/lib/api/mock-data';
import { getWebSocketClient } from '@/lib/api/websocket-mock';

export interface Thread {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  consensusLevel: number;
  createdAt: string;
  author: string;
  supportCount: number;
  counterCount: number;
}

export interface Post {
  id: string;
  threadId: string;
  content: string;
  author: string;
  votes: number;
  createdAt: string;
  position?: 'for' | 'against' | 'neutral';
  supportCount: number;
  counterCount: number;
}

export function useDebate() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<DebateTopic | null>(null);
  const [posts, setPosts] = useState<Record<string, DebatePost[]>>({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const wsRef = useRef<ReturnType<typeof useWebSocket> | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      const topics = await topicsAPI.getAll();
      const threadData: Thread[] = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        status: 'active',
        tags: topic.tags || [],
        consensusLevel: calculateConsensus(topic.supportCount || 0, topic.counterCount || 0),
        createdAt: topic.createdAt,
        author: topic.author.name,
        supportCount: topic.supportCount || 0,
        counterCount: topic.counterCount || 0,
      }));
      setThreads(threadData);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setLoading(true);
    try {
      const topic = await topicsAPI.getById(threadId);
      if (!topic) {
        setActiveThread(null);
        return;
      }

      setActiveThread(topic);

      // Load posts for this thread
      const threadPosts = await postsAPI.getByThreadId(threadId);
      setPosts(prev => ({
        ...prev,
        [threadId]: threadPosts,
      }));

      // Set up WebSocket for real-time updates
      if (!wsRef.current) {
        const { getWebSocketClient } = await import('@/lib/api/websocket-mock');
        wsRef.current = getWebSocketClient();
        wsRef.current.connect();
        wsRef.current.subscribe(threadId);
        
        wsRef.current.on('new-post', (data: { threadId: string; post: DebatePost }) => {
          if (data.threadId === threadId) {
            setPosts(prev => ({
              ...prev,
              [threadId]: [...(prev[threadId] || []), data.post],
            }));
          }
        });

        wsRef.current.on('vote-update', (data: { threadId: string; voteData: any }) => {
          if (data.threadId === threadId) {
            // Reload posts to get updated vote counts
            postsAPI.getByThreadId(threadId).then(updatedPosts => {
              setPosts(prev => ({
                ...prev,
                [threadId]: updatedPosts,
              }));
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = useCallback(async (title: string, description: string, tags: string[]) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      const newTopic = await topicsAPI.create({
        title,
        description,
        author: currentUser,
        tags,
      });
      
      // Reload threads
      await loadThreads();
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadThreads]);

  const createPost = useCallback(async (threadId: string, content: string, position?: 'support' | 'counter' | 'neutral') => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      const newPost = await postsAPI.create({
        threadId,
        content,
        author: currentUser,
        position: position || 'neutral',
      });

      // Update local state
      setPosts(prev => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), newPost],
      }));

      // Simulate WebSocket broadcast
      if (wsRef.current) {
        wsRef.current.simulateNewPost(threadId, newPost);
      }

      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const voteOnTopic = useCallback(async (topicId: string, type: 'support' | 'counter') => {
    if (!currentUser) return;
    
    try {
      await votesAPI.voteOnTopic(topicId, currentUser.id, type);
      
      // Reload threads to get updated counts
      await loadThreads();
      
      // If this is the active thread, reload it
      if (activeThread?.id === topicId) {
        await loadThread(topicId);
      }
    } catch (error) {
      console.error('Error voting on topic:', error);
    }
  }, [currentUser, loadThreads, activeThread, loadThread]);

  const voteOnPost = useCallback(async (postId: string, threadId: string, vote: 'up' | 'down') => {
    if (!currentUser) return;
    
    try {
      const voteType = vote === 'up' ? 'support' : 'counter';
      await votesAPI.voteOnPost(postId, threadId, currentUser.id, voteType);
      
      // Update local state
      setPosts(prev => {
        const threadPosts = prev[threadId] || [];
        return {
          ...prev,
          [threadId]: threadPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                supportCount: vote === 'up' 
                  ? (post.supportCount || 0) + 1 
                  : (post.supportCount || 0),
                counterCount: vote === 'down' 
                  ? (post.counterCount || 0) + 1 
                  : (post.counterCount || 0),
              };
            }
            return post;
          }),
        };
      });

      // Simulate WebSocket broadcast
      if (wsRef.current) {
        wsRef.current.simulateVoteUpdate(threadId, { postId, voteType });
      }
    } catch (error) {
      console.error('Error voting on post:', error);
    }
  }, [currentUser]);

  const getUserVote = useCallback((topicId?: string, postId?: string) => {
    if (!currentUser) return null;
    return votesAPI.getUserVote(topicId, postId, currentUser.id);
  }, [currentUser]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  return {
    threads,
    activeThread,
    posts,
    loading,
    currentUser,
    loadThreads,
    loadThread,
    createTopic,
    createPost,
    voteOnTopic,
    voteOnPost,
    getUserVote,
  };
}

// Helper function to calculate consensus level
function calculateConsensus(support: number, counter: number): number {
  const total = support + counter;
  if (total === 0) return 0.5; // Neutral if no votes
  return support / total;
}

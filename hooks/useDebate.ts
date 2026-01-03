'use client';

import { useState, useCallback } from 'react';

export interface Thread {
  id: string;
  title: string;
  status: string;
  tags: string[];
  consensusLevel: number;
  createdAt: string;
  author: string;
}

export interface Post {
  id: string;
  threadId: string;
  content: string;
  author: string;
  votes: number;
  createdAt: string;
  position?: 'for' | 'against' | 'neutral';
}

export function useDebate() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Record<string, Post[]>>({});
  const [loading, setLoading] = useState(false);

  const loadThreads = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carga de threads
      // En producción, esto haría una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Datos de ejemplo
      const mockThreads: Thread[] = [
        {
          id: '1',
          title: 'Should AI have rights?',
          status: 'active',
          tags: ['AI', 'Ethics', 'Rights'],
          consensusLevel: 0.65,
          createdAt: new Date().toISOString(),
          author: 'User1',
        },
      ];
      
      setThreads(mockThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setLoading(true);
    try {
      // Simular carga de thread
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockThread: Thread = {
        id: threadId,
        title: 'Should AI have rights?',
        status: 'active',
        tags: ['AI', 'Ethics', 'Rights'],
        consensusLevel: 0.65,
        createdAt: new Date().toISOString(),
        author: 'User1',
      };
      
      setActiveThread(mockThread);
      
      // Cargar posts del thread
      const mockPosts: Post[] = [
        {
          id: '1',
          threadId,
          content: 'I believe AI should have certain rights as they become more sentient.',
          author: 'User2',
          votes: 5,
          createdAt: new Date().toISOString(),
          position: 'for',
        },
      ];
      
      setPosts((prev) => ({
        ...prev,
        [threadId]: mockPosts,
      }));
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const voteOnPost = useCallback((postId: string, threadId: string, vote: 'up' | 'down') => {
    setPosts((prev) => {
      const threadPosts = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: threadPosts.map((post) =>
          post.id === postId
            ? { ...post, votes: post.votes + (vote === 'up' ? 1 : -1) }
            : post
        ),
      };
    });
  }, []);

  return {
    threads,
    activeThread,
    posts,
    loading,
    loadThreads,
    loadThread,
    voteOnPost,
  };
}




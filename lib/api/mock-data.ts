// Mock data store for Debate engine
// This simulates a database in memory

import { User, DebateTopic, DebatePost, Vote } from '@/lib/types/debate';

// Mock users
const mockUsers: User[] = [
  { id: '1', name: 'John Williams', avatar: '/user-image-1.png' },
  { id: '2', name: 'Adam Tyler', avatar: '/user-image-2.png' },
  { id: '3', name: 'Sarah Lee', avatar: '/user-image-3.png' },
  { id: '4', name: 'Anthony Johnson' },
  { id: '5', name: 'Sharon Lee' },
  { id: '6', name: 'Elizabeth West' },
  { id: '7', name: 'Blessing North' },
];

// Mock debate topics
let mockTopics: DebateTopic[] = [
  {
    id: '1',
    title: 'The Internet Broke Us',
    description: 'The internet has atomized every social group. Constant information prevents deep understanding. Algorithms have reinforced isolation.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10h ago
    author: mockUsers[0],
    tags: ['Society', 'Technology', 'Social Media'],
    supportCount: 25,
    counterCount: 10,
  },
  {
    id: '2',
    title: 'AI is the Last Major Invention',
    description: 'AI is the ultimate invention engine. It will take over the process of discovery and shift humanity\'s role from creator to curator.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    author: mockUsers[1],
    tags: ['AI', 'Technology', 'Future'],
    supportCount: 250,
    counterCount: 250,
  },
  {
    id: '3',
    title: 'Stock Trading is Just Digital Gambling',
    description: 'Retail trading is a pure casino, driven by the dopamine hit of high-frequency trades and meme stock speculation.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    author: mockUsers[2],
    tags: ['Finance', 'Trading', 'Economics'],
    supportCount: 50,
    counterCount: 20,
  },
  {
    id: '4',
    title: 'The Three-Hour Movie is Always Ego',
    description: 'Long movie runtimes are a sign of lazy editing and directorial self-indulgence, disrespecting viewer time.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    author: mockUsers[3],
    tags: ['Film', 'Entertainment', 'Critique'],
    supportCount: 1000000,
    counterCount: 2500,
  },
];

// Mock posts by thread ID
const mockPosts: Record<string, DebatePost[]> = {
  '1': [
    {
      id: 'p1',
      threadId: '1',
      author: mockUsers[4],
      content: 'The internet merely revealed the divisions and conflicts that were already there.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      position: 'counter',
      supportCount: 2,
      counterCount: 1,
    },
    {
      id: 'p2',
      threadId: '1',
      author: mockUsers[5],
      content: 'The internet broke our ability to focus. We can\'t engage deeply with ideas anymore.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      position: 'support',
      supportCount: 2,
      counterCount: 0,
    },
    {
      id: 'p3',
      threadId: '1',
      author: mockUsers[6],
      content: 'The internet broke our geographic bonds. We lost connection to our local communities.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      position: 'support',
      supportCount: 1,
      counterCount: 0,
    },
  ],
  '2': [
    {
      id: 'p4',
      threadId: '2',
      author: mockUsers[0],
      content: 'AI will augment human creativity, not replace it. We\'ll work together.',
      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      position: 'support',
      supportCount: 45,
      counterCount: 12,
    },
  ],
  '3': [],
  '4': [],
};

// Mock votes by user ID and topic/post ID
const mockVotes: Map<string, Vote> = new Map();

// Helper to get current user (in real app, this would come from auth)
export function getCurrentUser(): User {
  return mockUsers[0]; // For now, return first user as current
}

// Topics API
export const topicsAPI = {
  getAll: async (): Promise<DebateTopic[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return [...mockTopics].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById: async (id: string): Promise<DebateTopic | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTopics.find(t => t.id === id) || null;
  },

  create: async (topic: Omit<DebateTopic, 'id' | 'createdAt' | 'supportCount' | 'counterCount'>): Promise<DebateTopic> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTopic: DebateTopic = {
      ...topic,
      id: `topic-${Date.now()}`,
      createdAt: new Date().toISOString(),
      supportCount: 0,
      counterCount: 0,
    };
    mockTopics = [newTopic, ...mockTopics];
    return newTopic;
  },
};

// Posts API
export const postsAPI = {
  getByThreadId: async (threadId: string): Promise<DebatePost[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPosts[threadId] || [];
  },

  create: async (post: Omit<DebatePost, 'id' | 'createdAt' | 'supportCount' | 'counterCount'>): Promise<DebatePost> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPost: DebatePost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      supportCount: 0,
      counterCount: 0,
    };
    
    if (!mockPosts[post.threadId]) {
      mockPosts[post.threadId] = [];
    }
    mockPosts[post.threadId].push(newPost);
    
    return newPost;
  },
};

// Votes API
export const votesAPI = {
  voteOnTopic: async (topicId: string, userId: string, type: 'support' | 'counter'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const voteKey = `topic-${topicId}-${userId}`;
    const existingVote = mockVotes.get(voteKey);
    
    const topic = mockTopics.find(t => t.id === topicId);
    if (!topic) return;
    
    // Remove old vote if exists
    if (existingVote) {
      if (existingVote.type === 'support') {
        topic.supportCount = Math.max(0, (topic.supportCount || 0) - 1);
      } else {
        topic.counterCount = Math.max(0, (topic.counterCount || 0) - 1);
      }
    }
    
    // Add new vote
    mockVotes.set(voteKey, { userId, type, topicId });
    if (type === 'support') {
      topic.supportCount = (topic.supportCount || 0) + 1;
    } else {
      topic.counterCount = (topic.counterCount || 0) + 1;
    }
  },

  voteOnPost: async (postId: string, threadId: string, userId: string, type: 'support' | 'counter'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const voteKey = `post-${postId}-${userId}`;
    const existingVote = mockVotes.get(voteKey);
    
    const posts = mockPosts[threadId] || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Remove old vote if exists
    if (existingVote) {
      if (existingVote.type === 'support') {
        post.supportCount = Math.max(0, (post.supportCount || 0) - 1);
      } else {
        post.counterCount = Math.max(0, (post.counterCount || 0) - 1);
      }
    }
    
    // Add new vote (one vote per user)
    mockVotes.set(voteKey, { userId, type, postId });
    if (type === 'support') {
      post.supportCount = (post.supportCount || 0) + 1;
    } else {
      post.counterCount = (post.counterCount || 0) + 1;
    }
  },

  getUserVote: (topicId?: string, postId?: string, userId?: string): Vote | null => {
    if (!userId) return null;
    if (topicId) {
      return mockVotes.get(`topic-${topicId}-${userId}`) || null;
    }
    if (postId) {
      return mockVotes.get(`post-${postId}-${userId}`) || null;
    }
    return null;
  },
};


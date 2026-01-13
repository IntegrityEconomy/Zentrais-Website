// Data models for Debate (Perspective) engine

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface DebateTopic {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: User;
  tags?: string[];
  supportCount?: number;
  counterCount?: number;
}

export interface DebatePost {
  id: string;
  threadId: string;
  author: User;
  content: string;
  createdAt: string;
  position?: 'support' | 'counter' | 'neutral';
  supportCount?: number;
  counterCount?: number;
}

export interface Vote {
  userId: string;
  type: 'support' | 'counter';
  postId?: string; // If voting on a post
  topicId?: string; // If voting on a topic
}

export interface DebateThread {
  id: string;
  topic: DebateTopic;
  posts: DebatePost[];
  totalSupport: number;
  totalCounter: number;
}


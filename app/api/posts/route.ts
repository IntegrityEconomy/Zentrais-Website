import { NextRequest, NextResponse } from 'next/server';
import { topicsAPI, postsAPI } from '@/lib/api/mock-data';

// Mock posts database - shared across requests
// In production, this would be a real database
export let allPosts: Array<{
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  supportCount: number;
  counterCount: number;
  saved?: boolean;
  userId?: string;
}> = [
  {
    id: '1',
    title: "AI is the Last Major Invention",
    content: "AI isn't a tool, it's the ultimate invention engine. It will take over the process of discovery and shift humanity's role from creator to curator.",
    author: {
      id: '2',
      name: 'Adam Tyler',
      avatar: '/user-image-2.png',
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    supportCount: 250,
    counterCount: 250,
    saved: false,
  },
  {
    id: '2',
    title: 'The Internet Broke Us',
    content: "We mistook speed for connection. Online life hasn't united us—it's atomized every social group. Constant information prevents deep understanding. Algorithms have reinforced isolation.",
    author: {
      id: '1',
      name: 'John Williams',
      avatar: '/user-image-1.png',
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    supportCount: 25,
    counterCount: 10,
    saved: false,
  },
  {
    id: '3',
    title: 'Stock Trading is Just Digital Gambling',
    content: "Forget 'investment principles.' For most retail traders, stock trading is a pure casino, driven by the dopamine hit of high-frequency trades and meme stock speculation.",
    author: {
      id: '3',
      name: 'Sarah Lee',
      avatar: '/user-image-3.png',
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    supportCount: 50,
    counterCount: 20,
    saved: false,
  },
  {
    id: '4',
    title: "The Three-Hour Movie is Always Ego",
    content: "Nobody needs that much run-time. A truly great film respects the viewer's time. Long runtimes are a sign of lazy editing and directorial self-indulgence.",
    author: {
      id: '4',
      name: 'Anthony Johnson',
    },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    supportCount: 1000000,
    counterCount: 2500,
    saved: false,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const userId = request.headers.get('x-user-id') || '1'; // In production, get from auth token

    if (type === 'my-perspectives') {
      const myPosts = allPosts.filter((p) => p.userId === userId || p.author.id === userId);
      return NextResponse.json({ posts: myPosts, myPosts });
    }

    return NextResponse.json({
      posts: allPosts,
      myPosts: allPosts.filter((p) => p.userId === userId || p.author.id === userId),
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, userId } = await request.json();
    const authorId = request.headers.get('x-user-id') || userId || '1';

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newPost = {
      id: `post_${Date.now()}`,
      title,
      content,
      author: {
        id: authorId,
        name: 'Current User', // In production, get from user database
        avatar: '/user-image-1.png',
      },
      createdAt: new Date().toISOString(),
      supportCount: 0,
      counterCount: 0,
      saved: false,
      userId: authorId,
    };

    allPosts.unshift(newPost);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


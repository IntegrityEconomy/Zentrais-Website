// Next.js API route handler for creating posts in a debate thread

import { NextRequest, NextResponse } from 'next/server';
import { postsAPI, topicsAPI } from '@/lib/api/mock-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { content, author, position } = body;

    if (!content || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: content, author' },
        { status: 400 }
      );
    }

    // Verify thread exists
    const topic = await topicsAPI.getById(params.id);
    if (!topic) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    const newPost = await postsAPI.create({
      threadId: params.id,
      content,
      author,
      position: position || 'neutral',
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}


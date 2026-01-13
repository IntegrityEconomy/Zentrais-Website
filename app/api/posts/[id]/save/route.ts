import { NextRequest, NextResponse } from 'next/server';

// Mock saved posts database
const savedPosts: Record<string, Set<string>> = {};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const userId = request.headers.get('x-user-id') || '1';

    if (!savedPosts[userId]) {
      savedPosts[userId] = new Set();
    }

    if (savedPosts[userId].has(postId)) {
      savedPosts[userId].delete(postId);
      return NextResponse.json({ saved: false, message: 'Post unsaved' });
    } else {
      savedPosts[userId].add(postId);
      return NextResponse.json({ saved: true, message: 'Post saved' });
    }
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


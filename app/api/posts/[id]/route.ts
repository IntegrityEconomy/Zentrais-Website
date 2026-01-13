import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from '../route';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const userId = request.headers.get('x-user-id') || '1';

    // In production, verify user owns the post
    const postIndex = allPosts.findIndex((p) => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const post = allPosts[postIndex];
    if (post.userId !== userId && post.author.id !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    allPosts.splice(postIndex, 1);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


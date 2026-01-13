// Next.js API route handler for voting on topics or posts

import { NextRequest, NextResponse } from 'next/server';
import { votesAPI, topicsAPI } from '@/lib/api/mock-data';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, type, postId } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type' },
        { status: 400 }
      );
    }

    if (type !== 'support' && type !== 'counter') {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "support" or "counter"' },
        { status: 400 }
      );
    }

    // If postId is provided, vote on post; otherwise vote on topic
    if (postId) {
      await votesAPI.voteOnPost(postId, params.id, userId, type);
    } else {
      // Verify topic exists
      const topic = await topicsAPI.getById(params.id);
      if (!topic) {
        return NextResponse.json(
          { error: 'Topic not found' },
          { status: 404 }
        );
      }
      await votesAPI.voteOnTopic(params.id, userId, type);
    }

    return NextResponse.json(
      { success: true, message: 'Vote recorded' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}


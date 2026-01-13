// Next.js API route handler for debate thread (topic + posts)

import { NextRequest, NextResponse } from 'next/server';
import { topicsAPI, postsAPI } from '@/lib/api/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await topicsAPI.getById(params.id);
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    const posts = await postsAPI.getByThreadId(params.id);

    return NextResponse.json(
      { 
        thread: {
          topic,
          posts,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thread' },
      { status: 500 }
    );
  }
}


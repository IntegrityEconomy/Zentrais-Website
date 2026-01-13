// Next.js API route handler for debate topics
// This is a mock implementation that can later be replaced with AWS backend calls

import { NextRequest, NextResponse } from 'next/server';
import { topicsAPI } from '@/lib/api/mock-data';
import { DebateTopic } from '@/lib/types/debate';

export async function GET(request: NextRequest) {
  try {
    const topics = await topicsAPI.getAll();
    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, author, tags } = body;

    if (!title || !description || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, author' },
        { status: 400 }
      );
    }

    const newTopic = await topicsAPI.create({
      title,
      description,
      author,
      tags: tags || [],
    });

    return NextResponse.json({ topic: newTopic }, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}


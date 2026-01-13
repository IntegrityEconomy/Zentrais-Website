import { NextRequest, NextResponse } from 'next/server';

// Mock user preferences database
const userTopics: Record<string, string[]> = {};

export async function POST(request: NextRequest) {
  try {
    const { topics } = await request.json();
    const userId = request.headers.get('x-user-id') || '1'; // In production, get from auth token

    if (!topics || !Array.isArray(topics)) {
      return NextResponse.json(
        { message: 'Topics array is required' },
        { status: 400 }
      );
    }

    if (topics.length < 3) {
      return NextResponse.json(
        { message: 'At least 3 topics are required' },
        { status: 400 }
      );
    }

    userTopics[userId] = topics;

    return NextResponse.json({
      message: 'Topics saved successfully',
      topics,
    });
  } catch (error) {
    console.error('Error saving topics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || '1'; // In production, get from auth token

    const topics = userTopics[userId] || [];

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


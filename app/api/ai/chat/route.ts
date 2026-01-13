import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { message, threadId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized: missing bearer token' },
        { status: 401 }
      );
    }

    const res = await fetch(`${DIALOGUE_BACKEND_URL.replace(/\/$/, '')}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        message,
        ...(threadId ? { threadId } : {}),
      }),
    });

    const text = await res.text();
    let payload: any = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    return NextResponse.json(payload, { status: res.status });
  } catch (error) {
    console.error('Error processing AI chat:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


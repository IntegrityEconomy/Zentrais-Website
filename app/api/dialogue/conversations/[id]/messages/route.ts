import { NextRequest, NextResponse } from 'next/server';

// Mock messages database - matching wireframe
const messages: Record<string, Array<{
  id: string;
  text: string;
  sender: 'user' | 'other';
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
}>> = {
  '1': [
    {
      id: '1',
      text: 'Hi Hassan',
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 7:06am equivalent
    },
    {
      id: '2',
      text: 'Should I send over the document?',
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), // 7:10am equivalent
    },
    {
      id: '3',
      text: 'Hi',
      sender: 'other',
      senderName: 'Hassan R.',
      senderAvatar: '/user-image-1.png',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 8:00am equivalent
    },
    {
      id: '4',
      text: "Yes, please Dot!",
      sender: 'other',
      senderName: 'Hassan R.',
      senderAvatar: '/user-image-1.png',
      timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(), // 8:01am equivalent
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const conversationMessages = messages[conversationId] || [];

    return NextResponse.json({ messages: conversationMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { message: 'Message text is required' },
        { status: 400 }
      );
    }

    if (!messages[conversationId]) {
      messages[conversationId] = [];
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      text,
      sender: 'user' as const,
      senderName: 'You',
      timestamp: new Date().toISOString(),
    };

    messages[conversationId].push(newMessage);

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


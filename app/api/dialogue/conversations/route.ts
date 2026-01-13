import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch chat list from backend
    const response = await fetch(`${DIALOGUE_BACKEND_URL}/messages/chats/${userId}`);
    
    if (!response.ok) {
      console.error('Backend error:', response.status);
      return NextResponse.json({ conversations: [] });
    }

    const chatList = await response.json();

    // Transform backend response to match frontend format
    const conversations = chatList.map((chat: {
      chatUserId: string;
      chatUsername: string;
      lastMessage: string;
      lastMessageType: string;
      lastMessageTime: string;
    }) => ({
      id: chat.chatUserId,
      name: chat.chatUsername,
      avatar: undefined,
      lastMessage: chat.lastMessage || '',
      timestamp: chat.lastMessageTime,
      unread: 0,
      status: 'away' as const,
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ conversations: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { recipientId, recipientUsername } = await request.json();

    if (!recipientId && !recipientUsername) {
      return NextResponse.json(
        { message: 'Recipient ID or username is required' },
        { status: 400 }
      );
    }

    // Return a new conversation object
    // The actual conversation will be created when the first message is sent
    const conversation = {
      id: recipientId || recipientUsername,
      name: recipientUsername || recipientId,
      avatar: undefined,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: 0,
      status: 'away' as const,
    };

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


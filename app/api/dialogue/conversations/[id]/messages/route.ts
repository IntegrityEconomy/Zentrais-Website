import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';
import { getUserIdFromRequest } from '@/lib/auth';

interface BackendMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'AUDIO';
  mediaUrl: string | null;
  createdAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationPartnerId } = await params;
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all messages for the current user from backend
    const response = await fetch(`${DIALOGUE_BACKEND_URL}/messages/${userId}`);
    
    if (!response.ok) {
      console.error('Backend error:', response.status);
      return NextResponse.json({ messages: [] });
    }

    const allMessages: BackendMessage[] = await response.json();

    // Filter messages for this specific conversation (with conversationPartnerId)
    const conversationMessages = allMessages.filter(
      (msg) =>
        (msg.senderId === userId && msg.receiverId === conversationPartnerId) ||
        (msg.senderId === conversationPartnerId && msg.receiverId === userId)
    );

    // Transform to frontend format
    const messages = conversationMessages.map((msg) => ({
      id: msg.id,
      text: msg.content || (msg.type === 'IMAGE' ? '[Image]' : msg.type === 'AUDIO' ? '[Audio]' : ''),
      sender: msg.senderId === userId ? 'user' : 'other',
      senderName: msg.senderId === userId ? 'You' : 'User',
      timestamp: msg.createdAt,
      type: msg.type,
      mediaUrl: msg.mediaUrl,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: receiverId } = await params;
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { text, type = 'TEXT', mediaUrl } = await request.json();

    if (!text && type === 'TEXT') {
      return NextResponse.json(
        { message: 'Message text is required' },
        { status: 400 }
      );
    }

    // Messages are sent via WebSocket (chat.gateway.ts -> send_message)
    // This endpoint just returns a placeholder for optimistic UI update
    // The actual message is persisted when sent through WebSocket
    const newMessage = {
      id: `temp_${Date.now()}`,
      text: text || '',
      sender: 'user' as const,
      senderName: 'You',
      timestamp: new Date().toISOString(),
      type,
      mediaUrl,
      receiverId,
      senderId: userId,
    };

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


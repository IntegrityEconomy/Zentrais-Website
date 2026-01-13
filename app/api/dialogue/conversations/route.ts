import { NextRequest, NextResponse } from 'next/server';

// Mock conversations database - matching wireframe data
const conversations = [
  {
    id: '1',
    name: 'Hassan R.',
    avatar: '/user-image-1.png',
    lastMessage: "I'm on my way",
    timestamp: new Date(Date.now() - 0 * 60 * 1000).toISOString(), // Just now
    unread: 0,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Racheal B.',
    avatar: '/user-image-2.png',
    lastMessage: 'Nice Work',
    timestamp: new Date(Date.now() - 0 * 60 * 1000).toISOString(), // Just now
    unread: 0,
    status: 'away' as const,
    hasPencil: true, // Green pencil icon
  },
  {
    id: '3',
    name: 'Adam V.',
    avatar: '/user-image-3.png',
    lastMessage: 'Thanks for the update',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    unread: 2,
    status: 'away' as const,
  },
  {
    id: '4',
    name: 'Racheal F.',
    avatar: '/user-image-2.png',
    lastMessage: 'See you tomorrow',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    unread: 0,
    status: 'away' as const,
    hasPencil: true, // Green pencil icon
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


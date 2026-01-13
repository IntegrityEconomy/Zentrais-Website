import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Call backend to verify user exists
    const response = await fetch(`${DIALOGUE_BACKEND_URL}/messages/user/verify/${userId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { exists: false, message: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { exists: false, message: 'Failed to verify user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { exists: false, message: 'Service unavailable' },
      { status: 503 }
    );
  }
}

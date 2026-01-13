import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call the backend dialogue service
    const response = await fetch(`${DIALOGUE_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Invalid email or password' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      token: data.token,
      user: {
        id: data.user?.id || data.userId,
        email: email,
      },
      rememberMe,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Unable to connect to authentication service' },
      { status: 503 }
    );
  }
}


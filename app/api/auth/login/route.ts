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
      // Extract error message from various possible response formats
      const errorMessage = data.message || data.error || data.statusMessage || 'Invalid email or password';
      console.error('Login failed:', { status: response.status, error: errorMessage, data });
      return NextResponse.json(
        { message: errorMessage },
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Login error:', errorMessage, error);
    
    // Check if it's a connection error
    if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('network')) {
      return NextResponse.json(
        { message: 'Unable to connect to authentication service. Please ensure the backend is running.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: `Login failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}


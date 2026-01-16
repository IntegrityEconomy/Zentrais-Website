import { NextRequest, NextResponse } from 'next/server';
import { DIALOGUE_BACKEND_URL } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Call the backend dialogue service
    const response = await fetch(`${DIALOGUE_BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        username: fullName.replace(/\s+/g, '_').toLowerCase(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error message from various possible response formats
      const errorMessage = data.message || data.error || data.statusMessage || 'Registration failed';
      console.error('Signup failed:', { status: response.status, error: errorMessage, data });
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({
      token: data.token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: fullName,
      },
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Signup error:', errorMessage, error);
    
    // Check if it's a connection error
    if (errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('network')) {
      return NextResponse.json(
        { message: 'Unable to connect to authentication service. Please ensure the backend is running.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: `Registration failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}


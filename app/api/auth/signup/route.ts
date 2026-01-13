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
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Unable to connect to authentication service' },
      { status: 503 }
    );
  }
}


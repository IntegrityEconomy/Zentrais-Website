import { NextRequest } from 'next/server';

/**
 * Extract user ID from the authorization header token
 * In a real app, this would verify the JWT and extract the user ID
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // For now, we'll need to call the backend to verify the token
  // or decode the JWT locally if we have the secret
  // This is a simplified version - in production, verify the JWT properly
  try {
    // JWT tokens are base64 encoded: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.userId || null;
  } catch {
    return null;
  }
}

/**
 * Get user ID from localStorage token (client-side helper)
 */
export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.userId || null;
  } catch {
    return null;
  }
}

/**
 * Get auth token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

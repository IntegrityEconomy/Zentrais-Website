import { NextRequest } from 'next/server';

// Unified auth token key used across all services
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

/**
 * JWT Payload structure (unified across Dialogue and Exchange)
 */
export interface JwtPayload {
  userId: string;  // Dialogue format (primary)
  user_id?: string; // Exchange format (legacy support)
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * User data stored in localStorage
 */
export interface StoredUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Extract user ID from the authorization header token
 * Supports both Dialogue (userId) and Exchange (user_id) JWT formats
 */
export function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const payload = decodeJwtPayload(token);
  return payload?.userId || payload?.user_id || null;
}

/**
 * Decode JWT payload (client-side, without verification)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Handle both browser (atob) and server (Buffer) environments
    const base64 = parts[1];
    const jsonStr = typeof window !== 'undefined' 
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString();
    
    return JSON.parse(jsonStr) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  // Check if token expires in the next 60 seconds
  return payload.exp * 1000 < Date.now() + 60000;
}

/**
 * Get user ID from localStorage token (client-side helper)
 * Supports both Dialogue (userId) and Exchange (user_id) formats
 */
export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;
  
  const payload = decodeJwtPayload(token);
  return payload?.userId || payload?.user_id || null;
}

/**
 * Get stored user data
 */
export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as StoredUser;
  } catch {
    return null;
  }
}

/**
 * Get auth token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Store auth token and user data in localStorage
 */
export function storeAuth(token: string, user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove auth token and user data from localStorage
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated with a valid token
 */
export function isAuthenticated(): boolean {
  const token = getStoredToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

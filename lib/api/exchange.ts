/**
 * Exchange Backend API Client
 * Handles all API calls to the Exchange marketplace service
 * Uses unified JWT authentication from Dialogue backend
 */

import { EXCHANGE_BACKEND_URL } from '@/lib/config';
import { getAuthHeaders, getStoredToken, getStoredUserId, isAuthenticated } from '@/lib/auth';

// Types
export interface Listing {
  listing_id: string;
  seller_id: string;
  engine_source: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status: 'active' | 'sold' | 'inactive';
  credibility_indicator?: number;
  integrity_flags?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface CreateListingData {
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  location_name?: string;
  images?: string[];
}

export interface FeedParams {
  page?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'created_at' | 'price' | 'title';
  sort_order?: 'asc' | 'desc';
}

export interface SearchParams extends FeedParams {
  q?: string;
}

export interface ForYouParams {
  lat: number;
  lng: number;
  radius?: number;
  page?: number;
  limit?: number;
  category?: string;
}

// API Error class
export class ExchangeApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ExchangeApiError';
  }
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${EXCHANGE_BACKEND_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth header if authenticated
  const token = getStoredToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ExchangeApiError(response.status, data.error || 'API request failed');
  }

  return data as T;
}

// ============= Public Feed APIs =============

/**
 * Get paginated listing feed
 */
export async function getFeed(params: FeedParams = {}): Promise<PaginatedResponse<Listing>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  
  return apiCall<PaginatedResponse<Listing>>(`/api/feed?${searchParams.toString()}`);
}

/**
 * Search listings
 */
export async function searchListings(params: SearchParams = {}): Promise<PaginatedResponse<Listing>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  
  return apiCall<PaginatedResponse<Listing>>(`/api/feed/search?${searchParams.toString()}`);
}

/**
 * Get "For You" location-based feed
 */
export async function getForYouFeed(params: ForYouParams): Promise<PaginatedResponse<Listing>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value));
  });
  
  return apiCall<PaginatedResponse<Listing>>(`/api/feed/for-you?${searchParams.toString()}`);
}

/**
 * Get a single listing by ID
 */
export async function getListingById(id: string): Promise<Listing> {
  return apiCall<Listing>(`/api/listings/${id}`);
}

// ============= Authenticated APIs =============

/**
 * Create a new listing (requires auth)
 */
export async function createListing(data: CreateListingData): Promise<Listing> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  const sellerId = getStoredUserId();
  if (!sellerId) {
    throw new ExchangeApiError(401, 'User ID not found');
  }

  return apiCall<Listing>('/api/listings', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      seller_id: sellerId,
    }),
  });
}

/**
 * Update a listing (requires auth)
 */
export async function updateListing(id: string, data: Partial<CreateListingData>): Promise<Listing> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  return apiCall<Listing>(`/api/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a listing (requires auth)
 */
export async function deleteListing(id: string): Promise<void> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  await apiCall<void>(`/api/listings/${id}`, {
    method: 'DELETE',
  });
}

// ============= Saved Listings APIs =============

/**
 * Get user's saved listings (requires auth)
 */
export async function getSavedListings(): Promise<Listing[]> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  const userId = getStoredUserId();
  if (!userId) {
    throw new ExchangeApiError(401, 'User ID not found');
  }

  return apiCall<Listing[]>(`/api/users/${userId}/saved-listings`);
}

/**
 * Save a listing (requires auth)
 */
export async function saveListing(listingId: string): Promise<void> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  const userId = getStoredUserId();
  if (!userId) {
    throw new ExchangeApiError(401, 'User ID not found');
  }

  await apiCall<void>(`/api/users/${userId}/saved-listings/${listingId}`, {
    method: 'POST',
  });
}

/**
 * Unsave a listing (requires auth)
 */
export async function unsaveListing(listingId: string): Promise<void> {
  if (!isAuthenticated()) {
    throw new ExchangeApiError(401, 'Authentication required');
  }

  const userId = getStoredUserId();
  if (!userId) {
    throw new ExchangeApiError(401, 'User ID not found');
  }

  await apiCall<void>(`/api/users/${userId}/saved-listings/${listingId}`, {
    method: 'DELETE',
  });
}

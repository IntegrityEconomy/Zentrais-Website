import { Listing, CreateListingInput } from '../types/listing';
import { Message, Thread, CreateMessageInput, CreateThreadInput } from '../types/message';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// Helper to create timeout signal (compatible with Node.js and browser)
function createTimeoutSignal(ms: number): AbortSignal | undefined {
  // Only use timeout in Node.js environment (server-side)
  if (typeof window === 'undefined') {
    try {
      // Try to use AbortSignal.timeout if available (Node.js 17.3+)
      if (typeof AbortSignal.timeout === 'function') {
        return AbortSignal.timeout(ms);
      }
      // Fallback for older Node.js versions
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), ms);
      // Prevent memory leak by cleaning up if fetch completes early
      return controller.signal;
    } catch {
      // If AbortController is not available, don't use timeout
      return undefined;
    }
  }
  // Browser environment - don't use timeout for now
  return undefined;
}

// Helper to check if error is a connection error
function isConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('NetworkError') ||
      error.name === 'AbortError'
    );
  }
  return false;
}

export async function getListings(): Promise<Listing[]> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      cache: 'no-store',
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/listings`, fetchOptions);
    
    if (!response.ok) {
      console.error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('API server is not available. Make sure the backend is running on', API_BASE_URL);
    } else {
      console.error('Error fetching listings:', error);
    }
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      cache: 'no-store',
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch listing: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('API server is not available. Make sure the backend is running on', API_BASE_URL);
    } else {
      console.error('Error fetching listing:', error);
    }
    return null;
  }
}

export async function createListing(data: CreateListingInput): Promise<Listing> {
  try {
    // Log what we're sending (without full image data)
    const timeoutSignal = createTimeoutSignal(30000); // Increased timeout for image uploads
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/listings`, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to create listing: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    if (isConnectionError(error)) {
      throw new Error('Cannot connect to the API server. Make sure the backend is running.');
    }
    throw error;
  }
}

// Message API functions
export async function getMessageThreads(): Promise<Thread[]> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      cache: 'no-store',
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/messages/threads`, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      console.error(`Failed to fetch message threads: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('API server is not available. Make sure the backend is running on', API_BASE_URL);
    } else {
      console.error('Error fetching message threads:', error);
    }
    return [];
  }
}

export async function getMessages(threadId: string): Promise<Message[]> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      cache: 'no-store',
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/messages/threads/${threadId}`, fetchOptions);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      console.error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('API server is not available. Make sure the backend is running on', API_BASE_URL);
    } else {
      console.error('Error fetching messages:', error);
    }
    return [];
  }
}

export async function getOrCreateThread(listingId: string, receiverId: string): Promise<Thread> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId, receiverId }),
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/messages/threads`, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to get/create thread: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      throw new Error('Cannot connect to the API server. Make sure the backend is running.');
    }
    throw error;
  }
}

export async function sendMessage(data: CreateMessageInput): Promise<Message> {
  try {
    const timeoutSignal = createTimeoutSignal(5000);
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    if (timeoutSignal) {
      fetchOptions.signal = timeoutSignal;
    }
    
    const response = await fetch(`${API_BASE_URL}/messages`, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}. ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (isConnectionError(error)) {
      throw new Error('Cannot connect to the API server. Make sure the backend is running.');
    }
    throw error;
  }
}


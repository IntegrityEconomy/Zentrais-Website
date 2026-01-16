/**
 * Centralized configuration for the application
 */

// Backend service URLs
export const DIALOGUE_BACKEND_URL =
  process.env.NEXT_PUBLIC_DIALOGUE_BACKEND_URL ||
  process.env.DIALOGUE_BACKEND_URL ||
  'http://localhost:3001';

export const EXCHANGE_BACKEND_URL =
  process.env.NEXT_PUBLIC_EXCHANGE_BACKEND_URL ||
  process.env.EXCHANGE_BACKEND_URL ||
  'http://localhost:3002';

// Add other config values here as needed
export const config = {
  backend: {
    dialogueUrl: DIALOGUE_BACKEND_URL,
    exchangeUrl: EXCHANGE_BACKEND_URL,
  },
} as const;

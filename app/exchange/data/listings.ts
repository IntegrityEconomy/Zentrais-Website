import { Listing } from '../types';

/**
 * Sample listings for offline/fallback mode only.
 * In production, listings are fetched from the Exchange API.
 * This data is only used when the API is unavailable.
 */
export const SAMPLE_LISTINGS: Listing[] = [];

/**
 * @deprecated Use useExchangeAPI hook instead to fetch real listings from the backend.
 * This empty array is kept for backward compatibility during the transition.
 */
export const FALLBACK_LISTINGS: Listing[] = [];
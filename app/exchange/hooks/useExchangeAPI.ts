/**
 * useExchangeAPI Hook
 * React hook for interacting with Exchange marketplace API
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getFeed,
  searchListings,
  getForYouFeed,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getSavedListings,
  saveListing,
  unsaveListing,
  ExchangeApiError,
  type Listing,
  type PaginatedResponse,
  type FeedParams,
  type SearchParams,
  type ForYouParams,
  type CreateListingData,
} from '@/lib/api/exchange';
import { isAuthenticated } from '@/lib/auth';

export interface UseExchangeAPIReturn {
  // State
  listings: Listing[];
  savedListings: Listing[];
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Listing>['pagination'] | null;
  
  // Actions
  fetchFeed: (params?: FeedParams) => Promise<void>;
  search: (params?: SearchParams) => Promise<void>;
  fetchForYou: (params: ForYouParams) => Promise<void>;
  fetchListing: (id: string) => Promise<Listing | null>;
  createNewListing: (data: CreateListingData) => Promise<Listing | null>;
  updateExistingListing: (id: string, data: Partial<CreateListingData>) => Promise<Listing | null>;
  removeListng: (id: string) => Promise<boolean>;
  fetchSavedListings: () => Promise<void>;
  toggleSaveListing: (listingId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useExchangeAPI(): UseExchangeAPIReturn {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<Listing>['pagination'] | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof ExchangeApiError) {
      if (err.status === 401) {
        setError('Please log in to continue');
        router.push('/login');
      } else {
        setError(err.message);
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  const fetchFeed = useCallback(async (params: FeedParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFeed(params);
      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const search = useCallback(async (params: SearchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchListings(params);
      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchForYou = useCallback(async (params: ForYouParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForYouFeed(params);
      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchListing = useCallback(async (id: string): Promise<Listing | null> => {
    setLoading(true);
    setError(null);
    try {
      const listing = await getListingById(id);
      return listing;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createNewListing = useCallback(async (data: CreateListingData): Promise<Listing | null> => {
    if (!isAuthenticated()) {
      setError('Please log in to create a listing');
      router.push('/login');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const listing = await createListing(data);
      return listing;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, router]);

  const updateExistingListing = useCallback(async (
    id: string,
    data: Partial<CreateListingData>
  ): Promise<Listing | null> => {
    if (!isAuthenticated()) {
      setError('Please log in to update a listing');
      router.push('/login');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const listing = await updateListing(id, data);
      return listing;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, router]);

  const removeListng = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      setError('Please log in to delete a listing');
      router.push('/login');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.listing_id !== id));
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, router]);

  const fetchSavedListings = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const saved = await getSavedListings();
      setSavedListings(saved);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const toggleSaveListing = useCallback(async (listingId: string): Promise<boolean> => {
    if (!isAuthenticated()) {
      setError('Please log in to save listings');
      router.push('/login');
      return false;
    }

    setError(null);
    try {
      const isSaved = savedListings.some((l) => l.listing_id === listingId);
      
      if (isSaved) {
        await unsaveListing(listingId);
        setSavedListings((prev) => prev.filter((l) => l.listing_id !== listingId));
      } else {
        await saveListing(listingId);
        // Refetch saved listings to get the full listing data
        await fetchSavedListings();
      }
      return true;
    } catch (err) {
      handleError(err);
      return false;
    }
  }, [handleError, router, savedListings, fetchSavedListings]);

  return {
    listings,
    savedListings,
    loading,
    error,
    pagination,
    fetchFeed,
    search,
    fetchForYou,
    fetchListing,
    createNewListing,
    updateExistingListing,
    removeListng,
    fetchSavedListings,
    toggleSaveListing,
    clearError,
  };
}

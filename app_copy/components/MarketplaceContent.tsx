'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getListings } from '../lib/api';
import ListingCard from './ListingCard';
import { Listing } from '../types/listing';
import LocationSelector from './LocationSelector';

export default function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const searchTerm = searchParams?.get('q') || '';

  // Load selected location from localStorage
  useEffect(() => {
    const loadLocation = () => {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        setSelectedLocation(saved);
      } else {
        setSelectedLocation('');
      }
    };
    
    loadLocation();
    
    // Listen for storage changes (when location is updated from location page)
    window.addEventListener('storage', loadLocation);
    window.addEventListener('focus', loadLocation);
    
    // Custom event for same-window updates
    const handleLocationUpdate = () => loadLocation();
    window.addEventListener('locationUpdated', handleLocationUpdate);
    
    return () => {
      window.removeEventListener('storage', loadLocation);
      window.removeEventListener('focus', loadLocation);
      window.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters(searchTerm, selectedLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, listings, selectedLocation]);

  async function loadListings() {
    setIsLoading(true);
    setApiError(false);
    try {
      const data = await getListings();
      setListings(data);
      // Filtering will be applied by useEffect when listings or selectedLocation changes
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
      setFilteredListings([]);
      setApiError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to extract city and state from location string
  function extractLocationParts(location: string): { city: string; state: string; parts: string[] } {
    const parts = location.split(',').map(p => p.trim().toLowerCase());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1],
        parts: parts,
      };
    } else if (parts.length === 1) {
      return {
        city: parts[0],
        state: '',
        parts: parts,
      };
    }
    return { city: '', state: '', parts: [] };
  }

  // Helper function to check if listing location matches selected location
  function matchesLocation(listingLocation: string | undefined, selectedLoc: string): boolean {
    if (!selectedLoc.trim()) {
      return true; // No filter if no location selected
    }
    
    if (!listingLocation) {
      return false; // Listing has no location, don't show it
    }

    const selectedLower = selectedLoc.toLowerCase();
    const listingLower = listingLocation.toLowerCase();

    // Get parts from both locations
    const selectedParts = extractLocationParts(selectedLoc);
    const listingParts = extractLocationParts(listingLocation);

    // If both have city and state, check if they match
    if (selectedParts.city && selectedParts.state && listingParts.city && listingParts.state) {
      // Match if city matches and state matches (or state is contained in the other)
      const cityMatch = selectedParts.city === listingParts.city;
      const stateMatch = selectedParts.state === listingParts.state || 
                        listingParts.state.includes(selectedParts.state) ||
                        selectedParts.state.includes(listingParts.state);
      if (cityMatch && stateMatch) {
        return true;
      }
    }

    // Match if city matches (when both have city)
    if (selectedParts.city && listingParts.city) {
      if (selectedParts.city === listingParts.city) {
        return true;
      }
    }

    // Fallback: check if all words from selected location appear in listing location
    const selectedWords = selectedParts.parts.filter(p => p.length > 0);
    if (selectedWords.length > 0) {
      const allWordsMatch = selectedWords.every(word => listingLower.includes(word));
      if (allWordsMatch) {
        return true;
      }
    }

    // Final fallback: check if selected location string is contained in listing location
    return listingLower.includes(selectedLower);
  }

  function applyFilters(query: string, location: string) {
    let filtered = listings;

    // Apply location filter
    if (location.trim()) {
      filtered = filtered.filter((listing) => matchesLocation(listing.location, location));
    }

    // Apply search filter
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filtered = filtered.filter((listing) => {
        // Search in title
        if (listing.title.toLowerCase().includes(searchTerm)) {
          return true;
        }
        // Search in description
        if (listing.shortDescription.toLowerCase().includes(searchTerm)) {
          return true;
        }
        // Search in categories
        if (listing.categories && Array.isArray(listing.categories)) {
          if (listing.categories.some(cat => cat.toLowerCase().includes(searchTerm))) {
            return true;
          }
        }
        // Search in location
        if (listing.location && listing.location.toLowerCase().includes(searchTerm)) {
          return true;
        }
        return false;
      });
    }

    setFilteredListings(filtered);
  }

  function filterListings(query: string) {
    applyFilters(query, selectedLocation);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/');
    }
    filterListings(searchQuery);
  }

  // Exchange Home - Shows listings directly
  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900 pb-20 md:pb-8">
      {/* Exchange Title Section */}
      {!searchTerm ? (
        <div className="bg-transparent px-4 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Exchange</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Today's Picks</p>
            </div>
            {/* Location aligned to the right */}
            <div className="flex items-center">
              <LocationSelector location="Select Location" />
            </div>
            {/* Create Listing Button - Desktop Only */}
            <Link
              href="/listings/create"
              className="hidden md:flex items-center gap-2 bg-[#A05205] hover:bg-[#B86215] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Listing</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Search Header */
        <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 md:px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full px-4 py-2 pl-10 bg-[#F6EEE6] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205]"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            {/* Filter Icon */}
            <button className="text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8">

        {apiError && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              ⚠️ Unable to connect to the API server. Please make sure the backend is running.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="bg-[#F6EEE6] rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 && !apiError ? (
          <div className="bg-[#F6EEE6] rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-900 text-lg mb-4">
              {searchTerm ? 'No listings found for your search' : 'No listings found'}
            </p>
            <p className="text-gray-600 text-sm mb-6">
              {searchTerm ? 'Try a different search term' : 'Be the first to create a listing!'}
            </p>
            {!searchTerm && (
                <a
                  href="/listings/create"
                  className="inline-block bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Create Listing
                </a>
            )}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Floating Action Button - Mobile Only */}
      {!searchTerm && (
        <Link
          href="/listings/create"
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#A05205] hover:bg-[#B86215] text-white rounded-full flex items-center justify-center shadow-lg z-40 transition-colors md:hidden"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}

      {/* Bottom Navigation - Mobile Only */}
      {!searchTerm && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#F6EEE6]/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 z-40 md:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-around">
            {/* Exchange (Active) */}
            <Link href="/" className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg bg-[#A05205] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#A05205]">Exchange</span>
            </Link>
            
            {/* Chat */}
            <Link href="/messages" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#A05205] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                <circle cx="10" cy="12" r="1.5" fill="currentColor" />
                <circle cx="14" cy="12" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-xs">Chat</span>
            </Link>
            
            {/* Profile */}
            <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#A05205] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

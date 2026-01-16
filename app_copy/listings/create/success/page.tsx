'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getListing } from '../../../lib/api';
import { Listing } from '../../../types/listing';

export default function ListingSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const listingId = searchParams?.get('id');

  useEffect(() => {
    if (listingId) {
      loadListing();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  async function loadListing() {
    if (!listingId) return;
    
    try {
      const data = await getListing(listingId);
      setListing(data);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F6EEE6] text-gray-900 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Published!</h1>
          <p className="text-gray-600 mb-8">Your listing is now live on the marketplace.</p>

          {/* Actions */}
          <div className="space-y-3">
            {listing && (
              <Link
                href={`/listings/${listing.id}`}
                className="block w-full bg-[#A05205] hover:bg-[#B86215] text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                View Listing
              </Link>
            )}
            
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              Back to Exchange
            </Link>

            <Link
              href="/listings/create"
              className="block w-full text-[#A05205] hover:text-[#B86215] font-semibold py-2 transition-colors"
            >
              Create Another Listing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}


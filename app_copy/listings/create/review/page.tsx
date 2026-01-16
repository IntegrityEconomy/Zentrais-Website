'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createListing } from '../../../lib/api';
import { CreateListingInput } from '../../../types/listing';

export default function ReviewListing() {
  const router = useRouter();
  const [pendingListing, setPendingListing] = useState<CreateListingInput | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load pending listing from sessionStorage
    const saved = sessionStorage.getItem('pendingListing');
    if (saved) {
      try {
        setPendingListing(JSON.parse(saved));
      } catch (e) {
        setError('Failed to load listing data. Please start over.');
        console.error('Error parsing pending listing:', e);
      }
    } else {
      setError('No listing to review. Please start over.');
    }
  }, []);

  async function handlePublish() {
    if (!pendingListing) return;

    setIsPublishing(true);
    setError(null);

    try {
      const createdListing = await createListing(pendingListing);
      
      // Clear sessionStorage
      sessionStorage.removeItem('pendingListing');
      
      // Navigate to success page with listing ID
      router.push(`/listings/create/success?id=${createdListing.id}`);
    } catch (err) {
      console.error('Error publishing listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.');
      setIsPublishing(false);
    }
  }

  if (!pendingListing && !error) {
    return (
      <main className="min-h-screen bg-[#F6EEE6] text-gray-900 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (error && !pendingListing) {
    return (
      <main className="min-h-screen bg-[#F6EEE6] text-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
            {error}
          </div>
          <Link
            href="/listings/create"
            className="inline-block px-4 py-2 bg-[#A05205] text-white rounded-lg hover:bg-[#B86215] transition-colors"
          >
            Start Over
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900">
      {/* Header */}
      <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/listings/create" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Review Listing</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {pendingListing && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Title</h2>
              <p className="text-lg font-semibold text-gray-900">{pendingListing.title}</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Description</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{pendingListing.shortDescription}</p>
            </div>

            {/* Price */}
            {pendingListing.price && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Price</h2>
                <p className="text-xl font-bold text-[#A05205]">${Math.round(pendingListing.price)}</p>
              </div>
            )}

            {/* Categories */}
            {pendingListing.categories && pendingListing.categories.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {pendingListing.categories.map((cat, index) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {pendingListing.location && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Location</h2>
                <p className="text-gray-900">{pendingListing.location}</p>
              </div>
            )}

            {/* Proof/Reference Link */}
            {pendingListing.proofOrReferenceLink && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">Proof/Reference Link</h2>
                <a
                  href={pendingListing.proofOrReferenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A05205] hover:underline break-all"
                >
                  {pendingListing.proofOrReferenceLink}
                </a>
              </div>
            )}

            {/* Images */}
            {pendingListing.images && pendingListing.images.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-3">Images ({pendingListing.images.length})</h2>
                <div className="grid grid-cols-3 gap-3">
                  {pendingListing.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Link
                href="/listings/create"
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Edit Listing
              </Link>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 bg-[#A05205] hover:bg-[#B86215] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isPublishing ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


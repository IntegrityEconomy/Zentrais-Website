'use client';

import Link from 'next/link';
import { Listing } from '../types/listing';
import ListingCardImage from './ListingCardImage';

interface ListingCardProps {
  listing: Listing;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}min ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Use actual price from listing
  const displayPrice = listing.price !== undefined && listing.price !== null 
    ? `$${Math.round(listing.price)}` 
    : null;
  
  // Get first image or use placeholder
  const mainImage = listing.images && Array.isArray(listing.images) && listing.images.length > 0 
    ? listing.images[0] 
    : null;
  
  // Generate time ago
  const createdDate = listing.createdAt ? new Date(listing.createdAt) : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  const timeAgo = getTimeAgo(createdDate);
  
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-transparent rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer group">
        {/* Image with price overlay */}
        <div className="relative aspect-square bg-gradient-to-br from-[#3d4560] to-[#1a2332] rounded-lg overflow-hidden mb-2">
          <ListingCardImage 
            src={mainImage} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {displayPrice && (
            <div className="absolute bottom-3 left-3 bg-[#A05205] text-white font-bold px-3 py-1.5 rounded-lg text-base shadow-lg">
              {displayPrice}
            </div>
          )}
          {/* Heart icon - Disabled for MVP */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-50 cursor-not-allowed z-10"
            title="Favorites coming soon"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Card content */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
            {listing.title}
          </h3>
          <p className="text-gray-500 text-xs">{timeAgo}</p>
        </div>
      </div>
    </Link>
  );
}


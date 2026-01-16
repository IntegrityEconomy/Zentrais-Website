'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LocationSelectorProps {
  location: string;
  onLocationChange?: (location: string) => void;
}

export default function LocationSelector({ location }: LocationSelectorProps) {
  const [currentLocation, setCurrentLocation] = useState(location);

  useEffect(() => {
    // Load saved location from localStorage
    const loadLocation = () => {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) {
        setCurrentLocation(saved);
      }
    };
    
    loadLocation();
    
    // Listen for storage changes (when location is updated from location page)
    window.addEventListener('storage', loadLocation);
    window.addEventListener('focus', loadLocation);
    
    return () => {
      window.removeEventListener('storage', loadLocation);
      window.removeEventListener('focus', loadLocation);
    };
  }, []);

  return (
    <div className="relative">
      <Link
        href="/location"
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm cursor-pointer whitespace-nowrap text-[#A05205]"
      >
        <svg className="w-4 h-4 flex-shrink-0 text-[#A05205]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="hidden md:inline max-w-[120px] truncate">{currentLocation}</span>
        <svg 
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200 text-[#A05205]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
    </div>
  );
}

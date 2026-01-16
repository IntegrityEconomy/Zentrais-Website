'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentQuery = searchParams?.get('q') || '';

  useEffect(() => {
    setSearchQuery(currentQuery);
    setIsSearchOpen(!!currentQuery);
  }, [currentQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
      setIsSearchOpen(false);
    }
  }

  function handleSearchIconClick() {
    // Navigate to AI Feed instead of opening inline search
    router.push('/ai-feed');
  }

  function handleClearSearch() {
    setSearchQuery('');
    router.push('/');
    setIsSearchOpen(false);
  }

  return (
    <header className="bg-[#F6EEE6] text-gray-900 py-3 md:py-4 px-4 md:px-6 lg:px-8 sticky top-0 z-50 border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left Side - Profile Icon */}
        <Link
          href="/profile"
          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
          title="Profile"
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </Link>

        {/* Center - Zentrais Logo */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 hover:opacity-80 transition-opacity">
          <Image
            src="/Zentrais_logo.png"
            alt="Zentrais"
            width={40}
            height={40}
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
            priority
          />
        </Link>

        {/* Right Side - Search and Message Icon */}
        <div className="flex items-center gap-2 md:gap-4 relative flex-1 justify-end">
          {/* Search Bar or Icon */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  autoFocus
                  className="w-full px-4 py-2 pl-10 pr-20 bg-[#F6EEE6] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] transition-colors"
                />
                <svg
                  className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A05205]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4 text-[#b0b8c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-[#A05205] hover:text-[#B86215] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button
              onClick={handleSearchIconClick}
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Search"
            >
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-[#A05205]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          )}

          {/* Message/Chat Icon */}
          <Link 
            href="/messages" 
            className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 hover:bg-gray-100 rounded-lg transition-colors relative flex-shrink-0"
            title="Messages"
          >
            <svg 
              className="w-6 h-6 md:w-7 md:h-7 text-[#A05205]" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {/* Speech bubble with tail */}
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
              {/* Tail */}
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 20l1.395-3.72" 
              />
              {/* Two circles inside (eyes) */}
              <circle cx="10" cy="12" r="1.5" fill="currentColor" />
              <circle cx="14" cy="12" r="1.5" fill="currentColor" />
            </svg>
            {/* Sparkle above the bubble */}
            <svg 
              className="absolute -top-1 -right-1 w-3 h-3 text-[#A05205]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5L2 10l5.5-2.5L12 2z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}


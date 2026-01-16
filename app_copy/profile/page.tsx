'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MarketplaceContent from '../components/MarketplaceContent';

export default function ProfilePage() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Open drawer when component mounts
  useEffect(() => {
    setIsDrawerOpen(true);
  }, []);

  function handleLogout() {
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#F6EEE6] text-gray-900 relative">
      {/* Marketplace Content Behind Drawer */}
      <div className={`transition-all duration-300 ${isDrawerOpen ? 'opacity-30 pointer-events-none' : ''}`}>
        <MarketplaceContent />
      </div>
      
      {/* Side Drawer */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/30 pointer-events-auto"
            onClick={() => {
              setIsDrawerOpen(false);
              router.push('/');
            }}
          />
        )}
        {/* Drawer */}
        <div
          className={`fixed left-0 top-0 bottom-0 w-80 bg-[#8B7355] text-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col pointer-events-auto shadow-2xl ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Profile Section */}
          <div className="p-6 border-b border-[#9d8567]">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="w-20 h-20 rounded-full bg-[#6b5d47] border-4 border-white mb-4 overflow-hidden">
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              
              {/* View Full Profile Button */}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push('/');
                }}
                className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Exchange Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[#d4c5a9] uppercase tracking-wider px-6 mb-3">
                Exchange
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/listings/create"
                  className="block px-6 py-3 text-white hover:bg-[#9d8567] transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Create Listings
                </Link>
                <Link
                  href="/"
                  className="block px-6 py-3 text-white hover:bg-[#9d8567] transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  My Listings
                </Link>
                <Link
                  href="/messages"
                  className="block px-6 py-3 text-white hover:bg-[#9d8567] transition-colors"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Messages
                </Link>
              </nav>
            </div>

            {/* Account Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[#d4c5a9] uppercase tracking-wider px-6 mb-3">
                Account
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left block px-6 py-3 text-white hover:bg-[#9d8567] transition-colors"
                >
                  Settings & Privacy
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    router.push('/');
                  }}
                  className="w-full text-left block px-6 py-3 text-white hover:bg-[#9d8567] transition-colors"
                >
                  Help & Support
                </button>
              </nav>
            </div>
          </div>

          {/* Log Out Button */}
          <div className="p-6 border-t border-[#9d8567]">
            <button
              onClick={handleLogout}
              className="w-full text-[#ff6b9d] hover:text-[#ff8bb0] font-semibold py-3 transition-colors text-left"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Close Button (X) */}
        {isDrawerOpen && (
          <button
            onClick={() => {
              setIsDrawerOpen(false);
              router.push('/');
            }}
            className="fixed left-80 top-4 w-10 h-10 bg-[#8B7355] hover:bg-[#9d8567] text-white rounded-r-lg flex items-center justify-center transition-colors pointer-events-auto shadow-lg z-50"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


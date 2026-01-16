'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { BottomNav } from '@/components/app/BottomNav';
import { ChevronLeft, Filter, Heart, Loader2, MapPin, Plus, Search, Send, Sparkles, X } from 'lucide-react';
import { AIChatScreen, ChatHistorySidebar, ListingCard, FilterModal, LocationScreen, MessagingScreen,ProductDetailScreen, SearchResultCard, SellItemScreen } from './components';
import { cn, formatPrice, parseTimeAgoToMinutes } from './utils';
import { Listing, AIChatMessage, ChatHistory, SortBy, FilterDraft, ChatMessage } from './types';
import { DEFAULT_FILTERS } from './constants';
import { useAIChat, useExchangeFilters, useExchangeAPI } from './hooks';
import { getStoredUserId } from '@/lib/auth';

// Helper function to convert ISO date to relative time
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function ExchangePage() {
  // Fetch listings from API
  const { listings: apiListings, loading, error, fetchFeed } = useExchangeAPI();
  
  // Search query state
  const [query, setQuery] = useState('');
  
  // AI Chat state managed by custom hook
  const { aiMessages, aiInputText, setAiInputText, sendAIMessage } = useAIChat();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);

  // Convert API listings to frontend Listing type
  const listings: Listing[] = useMemo(() => {
    return apiListings.map((item) => ({
      id: item.listing_id,
      title: item.title,
      subtitle: item.category || 'Item',
      price: item.price || 0,
      timeAgo: getTimeAgo(item.created_at),
      imageUrl: item.images && item.images.length > 0 ? item.images[0] : '/placeholder-product.png',
      description: item.description,
      categories: item.category ? [item.category] : [],
      sellerName: 'Seller',
    }));
  }, [apiListings]);
  
  // Filter functionality managed by custom hook
  const {
    filterOpen,
    setFilterOpen,
    appliedFilters,
    draft,
    setDraft,
    filteredListings,
    applyDraftFilters,
    clearAllFilters
  } = useExchangeFilters(listings, query);
  const [chatHistories] = useState<ChatHistory[]>([]);

  // All existing state hooks
  const [mode, setMode] = useState<'grid' | 'search' | 'messaging' | 'sell' | 'detail' | 'location'>('grid');
  const [searchText, setSearchText] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selected, setSelected] = useState<Listing | null>(null);

  // Sell form state
  const [sellForm, setSellForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: 'Birmingham',
    images: [] as string[]
  });

  // Fetch listings on mount
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const openDetail = (id: string) => {
    setSelected(listings.find((l) => l.id === id) ?? null);
    setMode('detail');
  };

  const openMessaging = () => {
    setMode('messaging');
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Load location from localStorage
  useEffect(() => {
    const loadLocation = () => {
      const saved = localStorage.getItem('selectedLocation');
      if (saved) setSelectedLocation(saved);
    };
    
    loadLocation();
    window.addEventListener('storage', loadLocation);
    window.addEventListener('focus', loadLocation);
    window.addEventListener('locationUpdated', loadLocation);
    
    return () => {
      window.removeEventListener('storage', loadLocation);
      window.removeEventListener('focus', loadLocation);
      window.removeEventListener('locationUpdated', loadLocation);
    };
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // focus search input when entering search mode
  useEffect(() => {
    if (mode === 'search') requestAnimationFrame(() => inputRef.current?.focus());
    if (mode !== 'search') setFilterOpen(false);
  }, [mode, setFilterOpen]);

  // ✅ Location screen
  if (mode === 'location') {
    return (
      <LocationScreen
        onBack={() => setMode('grid')}
        onLocationSelect={(location) => setSelectedLocation(location)}
      />
    );
  }

  // ✅ Sell Item screen
  if (mode === 'sell') {
    return (
      <SellItemScreen
        onBack={() => setMode('grid')}
        onSuccess={() => fetchFeed()}
      />
    );
  }

  // ✅ Messaging screen
  if (mode === 'messaging' && selected) {
    return (
      <MessagingScreen
        item={selected}
        onBack={() => setMode('detail')}
      />
    );
  }

  // ✅ Detail screen (based on selected product)
  if (mode === 'detail' && selected) {
    return (
      <ProductDetailScreen
        item={selected}
        onBack={() => {
          // go back to where you came from (keep it simple: back to search if you were in search, else grid)
          setMode('grid'); // change to 'grid' if you want always back to grid
        }}
        onMessageSeller={openMessaging}
      />
    );
  }

  // Check if AI chat should be shown - after all hooks are called
  if (aiChatOpen) {
    return (
      <>
        <AIChatScreen
          aiMessages={aiMessages}
          aiInputText={aiInputText}
          setAiInputText={setAiInputText}
          sendAIMessage={sendAIMessage}
          setChatHistoryOpen={setChatHistoryOpen}
          setAiChatOpen={setAiChatOpen}
        />
        {chatHistoryOpen && <ChatHistorySidebar 
          chatHistories={chatHistories}
          setChatHistoryOpen={setChatHistoryOpen}
        />}
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/90 backdrop-blur">
        {mode === 'grid' ? (
          <>
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 pt-3 sm:max-w-full">
              {/* Profile Image - links to profile */}
              <a href="/profile" className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10 bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </a>

              {/* Zentrais Logo - center */}
              <a href="/exchange" className="grid h-10 w-10 place-items-center">
                <Image
                  src="/zentrais_log_marketplace.png"
                  alt="Zentrais Exchange"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setMode('search')}
                  className="grid h-10 w-10 place-items-center rounded-full active:scale-95 transition"
                >
                  <Search className="h-5 w-5 text-[#B56A1E]" />
                </button>
                <button 
                  type="button" 
                  aria-label="AI Chat" 
                  onClick={() => setAiChatOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-full active:scale-95 transition"
                >
                  <Sparkles className="h-5 w-5 text-[#B56A1E]" />
                </button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md px-4 pb-3 pt-2 sm:max-w-full">
              <h1 className="text-[28px] font-semibold leading-tight">Exchange</h1>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-slate-600">Todays Picks</p>

                <div className="flex items-center gap-1 text-[12px] text-slate-600">
                  <button
                    type="button"
                    onClick={() => setMode('location')}
                    className="flex items-center gap-1 hover:text-[#B56A1E] active:scale-95 transition"
                  >
                    <MapPin className="h-4 w-4 text-[#B56A1E]" />
                    <span>{selectedLocation || 'Set location'}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 pt-3 sm:max-w-full">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setMode('grid')}
                className="grid h-10 w-10 place-items-center rounded-full active:scale-95 transition"
              >
                <ChevronLeft className="h-5 w-5 text-[#B56A1E]" />
              </button>

              <a href="/exchange" className="grid h-10 w-10 place-items-center">
                <Image
                  src="/zentrais_log_marketplace.png"
                  alt="Zentrais Exchange"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </a>

              <a href="/profile" className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10 bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </a>
            </div>

            <div className="mx-auto w-full max-w-md px-4 pb-3 pt-3 sm:max-w-full">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center rounded-full bg-white/50 px-4 py-3 ring-1 ring-black/10">
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search items..."
                      className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Filter"
                  onClick={() => setFilterOpen(true)}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/50 ring-1 ring-black/10 active:scale-95 transition"
                >
                  <Filter className="h-5 w-5 text-[#B56A1E]" />
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      <FilterModal
        open={mode === 'search' && filterOpen}
        onClose={() => setFilterOpen(false)}
        draft={draft}
        setDraft={setDraft}
        onApply={applyDraftFilters}
        onClear={clearAllFilters}
      />

      <main className={cn('mx-auto w-full max-w-md px-4', 'pb-[calc(96px+env(safe-area-inset-bottom))]', 'sm:max-w-full')}>
        {mode === 'grid' ? (
          loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p>Loading listings...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <p className="mb-3">Failed to load listings</p>
              <button
                onClick={() => fetchFeed()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Retry
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="mb-2">No listings yet</p>
              <p className="text-sm">Be the first to list something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:mx-5 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((item) => (
                <ListingCard item={item} key={item.id} liked={likedIds.has(item.id)} onToggleLike={() => toggleLike(item.id)} onOpen={() => openDetail(item.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((item) => (
              <SearchResultCard key={`${item.id}-search`} item={item} onOpen={() => openDetail(item.id)} />
            ))}
          </div>
        )}
      </main>

      {/* Floating + button (hide in search mode) */}
      {mode === 'grid' && (
        <button
          type="button"
          onClick={() => setMode('sell')}
          aria-label="Create listing"
          className={cn(
            'fixed right-5 z-30 grid h-14 w-14 place-items-center rounded-full',
            'bg-[#B56A1E] text-white shadow-lg',
            'active:scale-95 transition',
            'bottom-[calc(84px+env(safe-area-inset-bottom))]'
          )}
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      <BottomNav />
    </div>
  );
}

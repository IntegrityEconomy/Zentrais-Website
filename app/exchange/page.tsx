'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BottomNav } from '@/components/app/BottomNav';
import { Camera, ChevronLeft, Filter, Heart, MapPin, Plus, Search, Send, Sparkles, X } from 'lucide-react';
import { AIChatScreen, ChatHistorySidebar, ListingCard, FilterModal, LocationScreen, MessagingScreen,ProductDetailScreen, SearchResultCard, SellItemScreen } from './components';
import { cn, formatPrice, parseTimeAgoToMinutes } from './utils';
import { Listing, AIChatMessage, ChatHistory, SortBy, FilterDraft, ChatMessage } from './types';
import { DEFAULT_FILTERS } from './constants';
import { SAMPLE_LISTINGS } from './data/listings';
import { useAIChat, useExchangeFilters } from './hooks';

export default function ExchangePage() {
  // Search query state
  const [query, setQuery] = useState('');
  
  // AI Chat state managed by custom hook
  const { aiMessages, aiInputText, setAiInputText, sendAIMessage } = useAIChat();
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  
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
  } = useExchangeFilters(SAMPLE_LISTINGS, query);
  const [chatHistories] = useState<ChatHistory[]>([
    { id: '1', title: 'Chat Title', lastMessage: 'Looking for antique tables...', timestamp: 'today' },
    { id: '2', title: 'Chat Title', lastMessage: 'Camera equipment search', timestamp: 'today' },
    { id: '3', title: 'Chat Title', lastMessage: 'Furniture recommendations', timestamp: 'today' },
    { id: '4', title: 'Chat Title', lastMessage: 'Electronics deals', timestamp: 'yesterday' },
    { id: '5', title: 'Chat Title', lastMessage: 'Vintage items query', timestamp: 'yesterday' },
    { id: '6', title: 'Chat Title', lastMessage: 'Pricing advice needed', timestamp: 'yesterday' },
    { id: '7', title: 'Chat Title', lastMessage: 'Local marketplace tips', timestamp: 'lastweek' },
    { id: '8', title: 'Chat Title', lastMessage: 'Negotiation strategies', timestamp: 'lastweek' },
    { id: '9', title: 'Chat Title', lastMessage: 'Best selling practices', timestamp: 'lastweek' },
  ]);

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

  const openDetail = (id: string) => {
    setSelected(SAMPLE_LISTINGS.find((l) => l.id === id) ?? null);
    setMode('detail');
  };

  const openMessaging = () => {
    setMode('messaging');
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Alberta');

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
              <button type="button" aria-label="Profile" className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10">
                <img
                  alt="Profile"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=60"
                />
              </button>

              <div className="grid h-10 w-10 place-items-center rounded-full">
                <span className="text-xl font-extrabold text-[#B56A1E]">o</span>
              </div>

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
                    <span>{selectedLocation}</span>
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

              <div className="grid h-10 w-10 place-items-center rounded-full">
                <span className="text-xl font-extrabold text-[#B56A1E]">o</span>
              </div>

              <button type="button" aria-label="Profile" className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10">
                <img
                  alt="Profile"
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=60"
                />
              </button>
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:mx-5 sm:grid-cols-3 lg:grid-cols-4">
            {SAMPLE_LISTINGS.map((item) => (
              <ListingCard item={item} key={item.id} isLiked={likedIds.has(item.id)} onLikeToggle={() => toggleLike(item.id)} onOpen={() => openDetail(item.id)}
              />
            ))}
          </div>
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

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getListings } from '../lib/api';
import { Listing } from '../types/listing';

interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestedListings?: Listing[];
}

export default function AIConversation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load listings for suggestions
    loadListings();

    // Initialize with query from URL if present
    const query = searchParams?.get('q');
    if (query) {
      setInput(query);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadListings() {
    try {
      const data = await getListings();
      setAllListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }

  // Simple keyword matching for MVP - in production this would be AI-powered
  function findMatchingListings(query: string): Listing[] {
    const lowerQuery = query.toLowerCase();
    const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

    return allListings.filter(listing => {
      const title = (listing.title || '').toLowerCase();
      const description = (listing.shortDescription || '').toLowerCase();
      const categories = (listing.categories || []).map(c => c.toLowerCase()).join(' ');

      return keywords.some(keyword => 
        title.includes(keyword) || 
        description.includes(keyword) || 
        categories.includes(keyword)
      );
    }).slice(0, 3); // Return max 3 matches
  }

  function handleSubmit(e: React.FormEvent, initialQuery?: string) {
    e.preventDefault();
    const query = initialQuery || input.trim();
    if (!query) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const matches = findMatchingListings(query);
      
      let aiContent: string;
      if (matches.length > 0) {
        aiContent = `I found ${matches.length} listing${matches.length > 1 ? 's' : ''} that might interest you:`;
      } else {
        aiContent = "I couldn't find any listings matching your search. Try rephrasing your query or browse all listings.";
      }

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: aiContent,
        timestamp: new Date(),
        suggestedListings: matches.length > 0 ? matches : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link 
            href="/ai-feed"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">AI Assistant</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Start a conversation by describing what you're looking for</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              <p className={`text-xs text-gray-500 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </p>

              {/* Suggested Listings */}
              {msg.suggestedListings && msg.suggestedListings.length > 0 && (
                <div className="w-full mt-3 space-y-2">
                  {msg.suggestedListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/listings/${listing.id}`}
                      className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-[#A05205] transition-colors"
                    >
                      <div className="flex gap-3">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{listing.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{listing.shortDescription}</p>
                          {listing.price && (
                            <p className="text-[#A05205] font-bold text-sm mt-1">${Math.round(listing.price)}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you're looking for..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#F6EEE6] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#A05205] hover:bg-[#B86215] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getListing } from '../../../lib/api';
import { getMessages, getOrCreateThread, sendMessage } from '../../../lib/api';
import { Listing } from '../../../types/listing';
import { Message } from '../../../types/message';
import Link from 'next/link';

// Placeholder user ID - in production this would come from auth context
const CURRENT_USER_ID = 'user-1';

export default function MessageSeller() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listingId = params?.id as string;

  useEffect(() => {
    if (listingId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load listing (may fail if deleted - that's okay)
      const listingData = await getListing(listingId);
      setListing(listingData);

      // Try to get thread ID from URL or create/get thread
      const urlThreadId = searchParams?.get('thread');
      
      if (urlThreadId) {
        setThreadId(urlThreadId);
        await loadMessages(urlThreadId);
      } else if (listingData) {
        // Create or get thread (requires receiver ID from listing)
        // For MVP, we'll use a placeholder receiver ID
        const receiverId = listingData.sellerName || 'seller-1';
        try {
          const thread = await getOrCreateThread(listingId, receiverId);
          setThreadId(thread.id);
          await loadMessages(thread.id);
        } catch (threadError) {
          console.error('Error creating/getting thread:', threadError);
          setError('Failed to start conversation. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      // Don't set error if listing is just not found - allow conversation to continue
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Failed to load conversation. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMessages(thread: string) {
    try {
      const data = await getMessages(thread);
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !threadId) return;

    const messageContent = message.trim();
    setMessage('');
    setIsSending(true);

    // Create temp message outside try block so it's accessible in catch
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      threadId: threadId,
      senderId: CURRENT_USER_ID,
      receiverId: listing?.sellerName || 'seller-1',
      content: messageContent,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      // Optimistically add message to UI
      setMessages(prev => [...prev, tempMessage]);

      // Send to backend
      if (listing) {
        const receiverId = listing.sellerName || 'seller-1';
        await sendMessage({
          threadId: threadId,
          senderId: CURRENT_USER_ID,
          receiverId: receiverId,
          content: messageContent,
        });

        // Reload messages to get the real one from server
        await loadMessages(threadId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F6EEE6] text-gray-900 flex items-center justify-center">
        <p className="text-gray-600">Loading conversation...</p>
      </main>
    );
  }

  const sellerName = listing?.sellerName || 'Seller';
  const displayPrice = listing?.price ? `$${Math.round(listing.price)}` : null;

  return (
    <main className="min-h-screen bg-[#F6EEE6] text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-[#F6EEE6] border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link 
            href={listing ? `/listings/${listing.id}` : '/'}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{sellerName}</h1>
          </div>
        </div>
      </div>

      {/* Product Card - only show if listing exists */}
      {listing && (
        <>
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-sm mb-1">{listing.title}</p>
                  {displayPrice && <p className="text-[#A05205] font-bold">${Math.round(listing.price!)}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Guidelines */}
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <p className="text-yellow-800 text-sm">
                Please do not pay for product unless delivered.{' '}
                <a href="#" className="underline font-semibold">Check our privacy guidelines</a>.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.senderId === CURRENT_USER_ID;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      {threadId && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isSending}
                className="flex-1 px-4 py-3 bg-[#F6EEE6] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A05205] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                className="bg-[#A05205] hover:bg-[#B86215] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

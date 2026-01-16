import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { Listing, ChatMessage } from '../types';
import { cn, formatPrice, getCurrentTimeString } from '../utils';
import { SAMPLE_MESSAGES } from '../constants';

interface MessagingScreenProps {
  item: Listing;
  onBack: () => void;
}

export function MessagingScreen({ item, onBack }: MessagingScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      time: getCurrentTimeString(),
      isFromMe: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/95 backdrop-blur border-b border-black/5">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="grid h-9 w-9 place-items-center rounded-full active:scale-95 transition"
            >
              <ChevronLeft className="h-5 w-5 text-[#B56A1E]" />
            </button>
            <h1 className="text-[18px] font-semibold text-slate-800">
              {item.sellerName || 'Sarah K.'}
            </h1>
          </div>
        </div>
      </header>

      {/* Product Info */}
      <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-slate-800">
              {item.title}
            </p>
            <p className="text-[16px] font-bold text-[#B56A1E]">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="mx-auto w-full max-w-md px-4 pb-2 sm:max-w-full">
        <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
          <p className="text-[12px] text-amber-800">
            ⏱️ Pls do not pay for product unless delivered
          </p>
          <button className="mt-1 text-[12px] font-medium text-amber-700 underline">
            Check our privacy guidelines
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="mx-auto w-full max-w-md flex-1 overflow-hidden px-4 sm:max-w-full">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.isFromMe ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2',
                    message.isFromMe
                      ? 'bg-[#B56A1E] text-white'
                      : 'bg-white ring-1 ring-black/10'
                  )}
                >
                  <p className="text-[14px]">{message.text}</p>
                  <p
                    className={cn(
                      'mt-1 text-[11px]',
                      message.isFromMe ? 'text-white/70' : 'text-slate-500'
                    )}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-[#F5EEE6]/95 backdrop-blur border-t border-black/5">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center rounded-full bg-white px-4 py-2 ring-1 ring-black/10">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full bg-transparent text-[14px] text-slate-800 placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={cn(
                'grid h-10 w-10 place-items-center rounded-full transition',
                newMessage.trim()
                  ? 'bg-[#B56A1E] text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
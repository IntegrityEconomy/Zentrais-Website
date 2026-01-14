'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Menu, Copy, RefreshCw, MessageSquare, X } from 'lucide-react';
import { BottomNav } from '@/components/app/BottomNav';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { getStoredToken } from '@/lib/auth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function AIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Start with empty messages
    setMessages([]);
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentInput, ...(threadId ? { threadId } : {}) }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data?.threadId && typeof data.threadId === 'string') {
          setThreadId(data.threadId);
        }

        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          text: data.response || 'No response received.',
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        let errorMsg = 'AI request failed.';
        try {
          const err = await response.json();
          errorMsg = err?.message || err?.detail || errorMsg;
        } catch {
          // ignore
        }

        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          text: errorMsg,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg z-50 text-sm';
    notification.textContent = 'Copied to clipboard';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#EFF3EC] flex flex-col pb-24">
        {/* Status Bar (mock) */}
        <div className="bg-[#EFF3EC] border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
            <div className="w-4 h-4 border border-gray-600 rounded-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            </div>
            <div className="w-6 h-3 border border-gray-600 rounded-sm"></div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#EFF3EC] border-b border-gray-200 flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-[#3C6610] hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3C6610] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-white" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Zentrais AI V.1.</p>
          </div>
          <button
            type="button"
            aria-label="Go to Dialogue"
            onClick={() => router.push('/dialogue')}
            className="p-2 text-[#3C6610] hover:bg-gray-100 rounded-full transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Side Menu - TODO: Navigation bar is not available yet */}
        {showMenu && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowMenu(false)}>
            <div
              className="absolute left-0 top-0 h-full w-80 bg-[#9AA98F] shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation bar content is not available */}
              <div className="p-4 border-b border-[#8a9a7f]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-semibold">Navigation</p>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-2 text-white hover:bg-[#8a9a7f] rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-white/80 text-sm text-center">Navigation bar is not available yet.</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#EFF3EC]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 text-sm">Start a conversation with Zentrais AI</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <button
                      onClick={() => handleCopy(message.text)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <p className="text-sm text-gray-500">Thinking...</p>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#EFF3EC] border-t border-gray-200 p-4">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Whats on your mind today?"
            className="bg-white border-gray-300 mb-2 rounded-full px-4 py-3"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || loading}
            className="w-full rounded-full bg-[#3C6610] hover:bg-[#2d4c0c] text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

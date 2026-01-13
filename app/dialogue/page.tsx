'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Edit, ArrowLeft, Send, Bot, X } from 'lucide-react';
import { BottomNav } from '@/components/app/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'active' | 'away';
  hasPencil?: boolean; // Green pencil icon indicator
}

export default function DialoguePage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/dialogue/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/dialogue/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text: messageText,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    // Send to backend
    try {
      await fetch(`/api/dialogue/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText }),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartNewConversation = async () => {
    if (!newUserId.trim()) return;

    // Create or find conversation with the user ID
    try {
      const response = await fetch('/api/dialogue/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: newUserId.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const conversationId = data.conversation?.id || `new_${newUserId.trim()}`;
        
        // Add to conversations list if it's a new one
        if (data.conversation && !conversations.find(c => c.id === data.conversation.id)) {
          setConversations(prev => [data.conversation, ...prev]);
        }
        
        setSelectedConversation(conversationId);
      } else {
        // Fallback: create a temporary conversation and navigate
        const tempConversation: Conversation = {
          id: `temp_${Date.now()}`,
          name: newUserId.trim(),
          lastMessage: '',
          timestamp: new Date().toISOString(),
          unread: 0,
          status: 'away',
        };
        setConversations(prev => [tempConversation, ...prev]);
        setSelectedConversation(tempConversation.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Fallback: create a temporary conversation locally
      const tempConversation: Conversation = {
        id: `temp_${Date.now()}`,
        name: newUserId.trim(),
        lastMessage: '',
        timestamp: new Date().toISOString(),
        unread: 0,
        status: 'away',
      };
      setConversations(prev => [tempConversation, ...prev]);
      setSelectedConversation(tempConversation.id);
    }

    setNewUserId('');
    setShowNewConversation(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    }
  };

  // Conversation Detail View
  if (selectedConversation) {
    const conversation = conversations.find((c) => c.id === selectedConversation);
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col pb-24">
          {/* Status Bar (mock) */}
          <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
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
          <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation?.avatar} />
                  <AvatarFallback>{conversation?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{conversation?.name}</p>
                  <p className="text-xs text-gray-500">
                    {conversation?.status === 'active' ? 'Active Now' : 'Away'}
                  </p>
                </div>
              </div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/user-image-1.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1.5 ${
                    message.sender === 'user' ? 'text-gray-500' : 'text-green-50'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type Something"
                className="flex-1 bg-white border-gray-300 rounded-full px-4 py-2.5 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2.5 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  // Dialog List View
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col pb-24">
        {/* Status Bar (mock) */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
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
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/user-image-1.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dialogs</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dialogue/ai')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open AI dialogue"
              >
                <Bot className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/dialogue/search')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {conversation.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {conversation.name}
                    </p>
                    <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(conversation.timestamp)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Edit className="w-3 h-3 text-white" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Floating New Conversation Button */}
        <button
          onClick={() => setShowNewConversation(true)}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center z-40"
          aria-label="Start new conversation"
        >
          <Edit className="w-6 h-6" />
        </button>

        {/* New Conversation Modal */}
        {showNewConversation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">New Conversation</h2>
                <button
                  onClick={() => {
                    setShowNewConversation(false);
                    setNewUserId('');
                  }}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Enter the user ID to start a conversation
              </p>
              <Input
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="Enter user ID"
                className="mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleStartNewConversation();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowNewConversation(false);
                    setNewUserId('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleStartNewConversation}
                  disabled={!newUserId.trim()}
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}

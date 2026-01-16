import React from 'react';
import { Search, X, Plus } from 'lucide-react';
import { ChatHistory } from '../types';

interface ChatHistorySidebarProps {
  chatHistories: ChatHistory[];
  setChatHistoryOpen: (open: boolean) => void;
}

export function ChatHistorySidebar({ chatHistories, setChatHistoryOpen }: ChatHistorySidebarProps) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-[#B56A1E] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-white" />
              <input 
                type="text" 
                placeholder="Search"
                className="bg-transparent text-white placeholder-white/70 text-sm focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setChatHistoryOpen(false)}
              className="text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-white/10">
          <button className="flex items-center space-x-2 text-white text-sm">
            <div className="w-4 h-4 border border-white rounded-sm flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </div>
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          {/* Today */}
          <div className="p-4">
            <h3 className="text-white/70 text-xs font-medium mb-3">Today</h3>
            {chatHistories
              .filter(chat => chat.timestamp === 'today')
              .map((chat) => (
                <div key={chat.id} className="flex items-center justify-between py-2 px-2 rounded hover:bg-white/10 cursor-pointer group">
                  <span className="text-white text-sm truncate flex-1">{chat.title}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-white/70">
                    <div className="w-4 h-4 flex justify-center items-center">•••</div>
                  </button>
                </div>
              ))}
          </div>

          {/* Yesterday */}
          <div className="p-4">
            <h3 className="text-white/70 text-xs font-medium mb-3">Yesterday</h3>
            {chatHistories
              .filter(chat => chat.timestamp === 'yesterday')
              .map((chat) => (
                <div key={chat.id} className="flex items-center justify-between py-2 px-2 rounded hover:bg-white/10 cursor-pointer group">
                  <span className="text-white text-sm truncate flex-1">{chat.title}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-white/70">
                    <div className="w-4 h-4 flex justify-center items-center">•••</div>
                  </button>
                </div>
              ))}
          </div>

          {/* Last Week */}
          <div className="p-4">
            <h3 className="text-white/70 text-xs font-medium mb-3">Last Week</h3>
            {chatHistories
              .filter(chat => chat.timestamp === 'lastweek')
              .map((chat) => (
                <div key={chat.id} className="flex items-center justify-between py-2 px-2 rounded hover:bg-white/10 cursor-pointer group">
                  <span className="text-white text-sm truncate flex-1">{chat.title}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-white/70">
                    <div className="w-4 h-4 flex justify-center items-center">•••</div>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Clear History */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center space-x-2 text-white text-sm">
            <div className="w-4 h-4 border border-white rounded-full"></div>
            <span>Clear History</span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="p-4">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=60"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className="flex-1 bg-black/20"
        onClick={() => setChatHistoryOpen(false)}
      />
    </div>
  );
}
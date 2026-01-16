import React from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { AIChatMessage } from '../types';

interface AIChatScreenProps {
  aiMessages: AIChatMessage[];
  aiInputText: string;
  setAiInputText: (text: string) => void;
  sendAIMessage: () => void;
  setChatHistoryOpen: (open: boolean) => void;
  setAiChatOpen: (open: boolean) => void;
}

export function AIChatScreen({ 
  aiMessages, 
  aiInputText, 
  setAiInputText, 
  sendAIMessage, 
  setChatHistoryOpen, 
  setAiChatOpen 
}: AIChatScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#F5EEE6] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-[#F5EEE6]/95 backdrop-blur border-b border-black/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setChatHistoryOpen(true)}
            className="p-2 rounded-full hover:bg-black/5"
          >
            <div className="w-5 h-5 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-[#B56A1E] rounded"></div>
              <div className="w-full h-0.5 bg-[#B56A1E] rounded"></div>
              <div className="w-full h-0.5 bg-[#B56A1E] rounded"></div>
            </div>
          </button>
          
          <div className="items-center space-x-2">
            <div className="flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-[#B56A1E]" />
            </div>
            <span className="text-sm text-slate-600">Zentrais AI V.1</span>
          </div>
          
          <button
            type="button"
            onClick={() => setAiChatOpen(false)}
            className="p-2"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col">
        {aiMessages.length === 0 ? (
          // Initial state
          <div className="flex-1 flex flex-col justify-center items-center px-4">
            <h1 className="text-2xl font-semibold text-slate-800 mb-8">Hey John</h1>
          </div>
        ) : (
          // Chat messages
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isFromAI ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isFromAI 
                    ? 'bg-white text-slate-800 border border-slate-200' 
                    : 'bg-[#B56A1E] text-white'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.imageResults && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {message.imageResults.slice(0, 4).map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-lg p-2">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-20 object-cover rounded-md mb-2"
                          />
                          <p className="text-xs font-medium text-slate-800">{item.title}</p>
                          <p className="text-xs text-[#B56A1E] font-semibold">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {message.imageResults && message.imageResults.length > 4 && (
                    <div className="mt-2">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <img 
                          src={message.imageResults[4].imageUrl} 
                          alt={message.imageResults[4].title}
                          className="w-full h-20 object-cover rounded-md mb-2"
                        />
                        <p className="text-xs font-medium text-slate-800">{message.imageResults[4].title}</p>
                        <p className="text-xs text-[#B56A1E] font-semibold">${message.imageResults[4].price}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-black/5 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendAIMessage();
                  }
                }}
                placeholder={aiMessages.length === 0 ? "What are you getting today" : "Type Something"}
                className="w-full bg-white border border-slate-300 rounded-full px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#B56A1E] focus:border-transparent"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
            <button
              type="button"
              onClick={sendAIMessage}
              disabled={!aiInputText.trim()}
              className="bg-[#B56A1E] hover:bg-[#b5957b] disabled:bg-[#b5957b] text-white rounded-full p-3 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
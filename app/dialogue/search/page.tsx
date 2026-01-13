'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BottomNav } from '@/components/app/BottomNav';

export default function DialogueSearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
        <div className="bg-white border-b border-gray-200 flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search existing and dialogs"
            className="flex-1 bg-white border-gray-300 rounded-full px-4 py-2.5"
          />
          <Avatar className="w-8 h-8">
            <AvatarImage src="/user-image-1.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Start typing to search conversations...</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { ThreadCard } from '@/components/debate/ThreadCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { useDebate } from '@/hooks/useDebate';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/app/BottomNav';

export default function DebateListPage() {
  const { threads, loading, loadThreads } = useDebate();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const filteredThreads = threads.filter(thread => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      thread.title.toLowerCase().includes(query) ||
      thread.description.toLowerCase().includes(query) ||
      thread.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-7xl pb-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Perspectives</h1>
            <p className="text-gray-400">Explore truth through structured argumentation</p>
          </div>
          <Button onClick={() => router.push('/debate/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            New Perspective
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Taglines e.g Cyberspace"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-black border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFilterOpen(!filterOpen)}
              className="gap-2 border-gray-700 text-gray-200"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-gray-700 rounded-lg shadow-lg p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white">Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSortBy('recent');
                    setFilterOpen(false);
                  }}
                  className="text-gray-300"
                >
                  Clear All
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-200">Sort By</label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                    >
                      Most Recent
                    </Button>
                    <Button
                      variant={sortBy === 'oldest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('oldest')}
                    >
                      Least Recent
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filter
              </Button>
            </div>
          )}
        </div>

        {/* Threads Grid */}
        {loading && threads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Loading perspectives...
          </div>
        ) : sortedThreads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No perspectives found matching your search.' : 'No perspectives yet. Be the first to create one!'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}

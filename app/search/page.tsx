'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Filter, Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/app/BottomNav';
import { Badge } from '@/components/ui/badge';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load recent searches from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent_searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    }

    // Perform search
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&time=${timeFilter}&sort=${sortBy}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
    // Trigger search automatically
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 p-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search Taglines e.g. Cyberspace"
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Filters</span>
                <button
                  onClick={() => {
                    setTimeFilter('');
                    setSortBy('recent');
                    setShowFilters(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear All Filters
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time</label>
                  <div className="flex gap-2">
                    {['Last 24hr', 'Last 7 days', 'Last 30Days'].map((option) => (
                      <Button
                        key={option}
                        variant={timeFilter === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTimeFilter(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
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
                <Button
                  onClick={() => {
                    setShowFilters(false);
                    handleSearch();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {searchQuery ? (
            // Search Results
            loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() => router.push(`/debate/${result.id}`)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{result.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">No results found</p>
              </div>
            )
          ) : (
            // Recent Searches
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, idx) => (
                    <Badge
                      key={idx}
                      onClick={() => handleRecentSearch(search)}
                      className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {search}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent searches</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}


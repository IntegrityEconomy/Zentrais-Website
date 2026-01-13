'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MoreVertical, Bookmark, Share2, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/app/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  supportCount: number;
  counterCount: number;
  saved?: boolean;
}

export default function FeedPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'for-you' | 'my-perspectives'>('for-you');
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?type=all');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setMyPosts(data.myPosts || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: 'POST',
      });
      if (response.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p))
        );
        // Show toast notification
        showNotification('Perspective has been added to your saved');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMyPosts((prev) => prev.filter((p) => p.id !== postId));
        showNotification('You have deleted this post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const showNotification = (message: string) => {
    // Simple notification - can be enhanced with a toast library
    const notification = document.createElement('div');
    notification.className =
      'fixed top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1H';
    return `${diffHours}H`;
  };

  const displayPosts = activeTab === 'for-you' ? posts : myPosts;
  const filteredPosts = searchQuery
    ? displayPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayPosts;

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('for-you')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'for-you'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    For You
                  </button>
                  <button
                    onClick={() => setActiveTab('my-perspectives')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'my-perspectives'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    My Perspectives
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/search')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/user-image-1.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading perspectives...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">
              {searchQuery ? 'No perspectives found.' : 'No perspectives yet.'}
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-xs text-gray-500">{formatTime(post.createdAt)}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {activeTab === 'my-perspectives' ? (
                        <>
                          <DropdownMenuItem onClick={() => handleDelete(post.id)}>
                            Delete Post
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/profile/${post.author.id}`)}>
                            View Profile
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => router.push(`/profile/${post.author.id}`)}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>Not Interested in this post</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Post Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-green-600">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.supportCount}</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.counterCount}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSave(post.id)}
                      className={`p-2 rounded-full transition-colors ${
                        post.saved ? 'text-pink-600' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={post.saved ? 'currentColor' : 'none'} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => router.push(`/debate/${post.id}`)}
                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700"
                    >
                      Add Perspective
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-28 right-4 z-20">
          {showCreateMenu ? (
            <div className="flex flex-col gap-3 mb-3">
              <Button
                onClick={() => {
                  setShowCreateMenu(false);
                  router.push('/debate/new');
                }}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                Perspective
              </Button>
              <Button
                onClick={() => {
                  setShowCreateMenu(false);
                  router.push('/dialogue/new');
                }}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                Dialog
              </Button>
              <Button
                onClick={() => {
                  setShowCreateMenu(false);
                  router.push('/exchange/new');
                }}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                Exchange
              </Button>
            </div>
          ) : null}
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-110"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}


'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostItem } from '@/components/debate/PostItem';
import { Badge } from '@/components/ui/badge';
import { useDebate } from '@/hooks/useDebate';

export default function ThreadDetailPage() {
  const params = useParams();
  const threadId = params.id as string;
  const { activeThread, posts, loading, loadThread, voteOnPost } = useDebate();

  useEffect(() => {
    if (threadId) {
      loadThread(threadId);
    }
  }, [threadId]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading thread...</div>;
  }

  if (!activeThread) {
    return <div className="container mx-auto py-8 text-center">Thread not found</div>;
  }

  const threadPosts = posts[threadId] || [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold">{activeThread.title}</h1>
          <Badge>{activeThread.status}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {activeThread.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-semibold">Consensus Level</span>
            <span>{Math.round(activeThread.consensusLevel * 100)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full"
              style={{ width: `${activeThread.consensusLevel * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Discussion ({threadPosts.length} posts)</h2>
        {threadPosts.map((post) => (
          <PostItem 
            key={post.id} 
            post={post} 
            onVote={voteOnPost}
          />
        ))}
      </div>

      {threadPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts yet. Be the first to contribute!
        </div>
      )}
    </div>
  );
}
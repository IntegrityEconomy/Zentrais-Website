'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostItem } from '@/components/debate/PostItem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDebate } from '@/hooks/useDebate';
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/date';
import { BottomNav } from '@/components/app/BottomNav';

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.id as string;
  const { 
    activeThread, 
    posts, 
    loading, 
    loadThread, 
    voteOnPost, 
    voteOnTopic,
    createPost,
    getUserVote,
    currentUser
  } = useDebate();
  
  const [newPostContent, setNewPostContent] = useState('');
  const [postPosition, setPostPosition] = useState<'support' | 'counter' | 'neutral'>('neutral');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    if (threadId) {
      loadThread(threadId);
    }
  }, [threadId, loadThread]);

  const threadPosts = posts[threadId] || [];
  const topicVote = activeThread ? getUserVote(activeThread.id) : null;

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !threadId) return;

    setIsSubmitting(true);
    try {
      await createPost(threadId, newPostContent, postPosition);
      setNewPostContent('');
      setPostPosition('neutral');
      setShowPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteTopic = async (type: 'support' | 'counter') => {
    if (!activeThread) return;
    await voteOnTopic(activeThread.id, type);
  };

  if (loading && !activeThread) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        Loading thread...
      </div>
    );
  }

  if (!activeThread) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="mb-4">Thread not found</p>
        <Button onClick={() => router.push('/debate')}>Back to Perspectives</Button>
      </div>
    );
  }

  const consensusLevel = activeThread.supportCount && activeThread.counterCount
    ? activeThread.supportCount / (activeThread.supportCount + activeThread.counterCount)
    : 0.5;

  return (
    <>
    <div className="container mx-auto py-8 px-4 max-w-4xl pb-24">
      {/* Header with back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/debate')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Topic Card */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={activeThread.author.avatar} />
            <AvatarFallback>{activeThread.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{activeThread.title}</h1>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <span>{activeThread.author.name}</span>
              <span>•</span>
              <span>{formatTimeAgo(activeThread.createdAt)}</span>
            </div>
            <p className="text-gray-200 leading-relaxed">{activeThread.description}</p>
          </div>
        </div>

        {/* Tags */}
        {activeThread.tags && activeThread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeThread.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Vote Stats */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">{activeThread.supportCount || 0}</span> Supported
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-red-600">{activeThread.counterCount || 0}</span> Countered
            </span>
          </div>
        </div>

        {/* Consensus Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-semibold">Consensus Level</span>
            <span>{Math.round(consensusLevel * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${consensusLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Vote Buttons */}
        <div className="flex gap-4">
          <Button
            variant={topicVote?.type === 'support' ? 'default' : 'outline'}
            onClick={() => handleVoteTopic('support')}
            className={`flex-1 gap-2 ${
              topicVote?.type === 'support' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : ''
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Support
          </Button>
          <Button
            variant={topicVote?.type === 'counter' ? 'default' : 'outline'}
            onClick={() => handleVoteTopic('counter')}
            className={`flex-1 gap-2 ${
              topicVote?.type === 'counter' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : ''
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            Counter
          </Button>
        </div>
      </div>

      {/* Post Form Toggle */}
      {!showPostForm && (
        <div className="mb-6">
          <Button
            onClick={() => setShowPostForm(true)}
            className="w-full"
          >
            Add Your Perspective
          </Button>
        </div>
      )}

      {/* Post Form */}
      {showPostForm && (
        <div className="mb-6 p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-4">Post Your Argument</h3>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={postPosition === 'support' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostPosition('support')}
                  className={postPosition === 'support' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                >
                  Supporting
                </Button>
                <Button
                  type="button"
                  variant={postPosition === 'counter' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostPosition('counter')}
                  className={postPosition === 'counter' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                >
                  Countering
                </Button>
                <Button
                  type="button"
                  variant={postPosition === 'neutral' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPostPosition('neutral')}
                >
                  Neutral
                </Button>
              </div>
            </div>
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write your argument here..."
              rows={4}
              required
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || !newPostContent.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Posting...' : 'Post Argument'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPostForm(false);
                  setNewPostContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          Discussion ({threadPosts.length} {threadPosts.length === 1 ? 'post' : 'posts'})
        </h2>
        {threadPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-lg">
            No posts yet. Be the first to contribute!
          </div>
        ) : (
          threadPosts.map((post) => {
            const userVote = getUserVote(undefined, post.id);
            return (
              <PostItem
                key={post.id}
                post={post}
                onVote={voteOnPost}
                userVote={userVote}
              />
            );
          })
        )}
      </div>
    </div>
    <BottomNav />
    </>
  );
}

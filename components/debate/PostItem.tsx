'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { DebatePost } from '@/lib/types/debate';
import { formatTimeAgo } from '@/lib/utils/date';

interface PostItemProps {
  post: DebatePost;
  onVote: (postId: string, threadId: string, vote: 'up' | 'down') => void;
  userVote?: { type: 'support' | 'counter' } | null;
}

export function PostItem({ post, onVote, userVote }: PostItemProps) {
  const handleVote = (vote: 'up' | 'down') => {
    onVote(post.id, post.threadId, vote);
  };

  const getPositionColor = (position?: string) => {
    switch (position) {
      case 'support':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'counter':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPositionLabel = (position?: string) => {
    switch (position) {
      case 'support':
        return 'Supporting';
      case 'counter':
        return 'Countering';
      case 'neutral':
        return 'Neutral';
      default:
        return 'Neutral';
    }
  };

  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <Card className="p-6 border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{post.author.name}</span>
              {post.position && (
                <Badge className={getPositionColor(post.position)}>
                  {getPositionLabel(post.position)}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-4">
        <Button
          variant={userVote?.type === 'support' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleVote('up')}
          className={`flex items-center gap-2 ${
            userVote?.type === 'support' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : ''
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{post.supportCount || 0}</span>
        </Button>
        <Button
          variant={userVote?.type === 'counter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleVote('down')}
          className={`flex items-center gap-2 ${
            userVote?.type === 'counter' 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : ''
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{post.counterCount || 0}</span>
        </Button>
      </div>
    </Card>
  );
}

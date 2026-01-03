'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Post } from '@/hooks/useDebate';

interface PostItemProps {
  post: Post;
  onVote: (postId: string, threadId: string, vote: 'up' | 'down') => void;
}

export function PostItem({ post, onVote }: PostItemProps) {
  const handleVote = (vote: 'up' | 'down') => {
    onVote(post.id, post.threadId, vote);
  };

  const getPositionColor = (position?: string) => {
    switch (position) {
      case 'for':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'against':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">{post.author}</span>
          {post.position && (
            <Badge className={getPositionColor(post.position)}>
              {post.position}
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote('up')}
          className="flex items-center gap-2"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{post.votes}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote('down')}
          className="flex items-center gap-2"
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}




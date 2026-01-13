'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Thread } from '@/hooks/useDebate';
import { formatTimeAgo } from '@/lib/utils/date';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/debate/${thread.id}`);
  };

  const timeAgo = formatTimeAgo(thread.createdAt);

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow border"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold flex-1 pr-2">{thread.title}</h3>
        <Badge variant="secondary">{thread.status}</Badge>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{thread.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {thread.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-image-1.png" />
            <AvatarFallback>{thread.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{thread.author}</span>
        </div>
        <span className="text-sm text-gray-500">{timeAgo}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className="text-gray-600">
              <span className="font-semibold text-green-600">{thread.supportCount}</span> Supported
            </span>
            <span className="text-gray-600">
              <span className="font-semibold text-red-600">{thread.counterCount}</span> Countered
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${thread.consensusLevel * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

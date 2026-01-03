'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thread } from '@/hooks/useDebate';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/debate/${thread.id}`);
  };

  return (
    <Card
      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold flex-1">{thread.title}</h3>
        <Badge>{thread.status}</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {thread.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Consensus</span>
          <span className="font-semibold">{Math.round(thread.consensusLevel * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${thread.consensusLevel * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        by {thread.author}
      </div>
    </Card>
  );
}




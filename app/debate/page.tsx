'use client';

import { useEffect } from 'react';
import { ThreadCard } from '@/components/debate/ThreadCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDebate } from '@/hooks/useDebate';
import { useRouter } from 'next/navigation';

export default function DebateListPage() {
  const { threads, loading, loadThreads } = useDebate();
  const router = useRouter();

  useEffect(() => {
    loadThreads();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Perspectives</h1>
          <p className="text-gray-600">Explore truth through structured argumentation</p>
        </div>
        <Button onClick={() => router.push('/debate/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Perspective
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}
'use client';

import { ThoughtEntry } from '@/components/debate/ThoughtEntry';

export default function NewDebatePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Create New Perspective</h1>
      <ThoughtEntry />
    </div>
  );
}
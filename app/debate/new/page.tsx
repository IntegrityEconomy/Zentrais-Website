'use client';

import { ThoughtEntry } from '@/components/debate/ThoughtEntry';
import { BottomNav } from '@/components/app/BottomNav';

export default function NewDebatePage() {
  return (
    <>
      <div className="container mx-auto py-8 px-4 pb-24">
        <ThoughtEntry />
      </div>
      <BottomNav />
    </>
  );
}

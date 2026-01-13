'use client';

import { BottomNav } from '@/components/app/BottomNav';

export default function ExchangePlaceholderPage() {
  return (
    <>
      <div className="container mx-auto py-12 px-4 max-w-md text-center pb-24">
        <h1 className="text-2xl font-semibold mb-2">Exchange</h1>
        <p className="text-gray-400">
          The Exchange engine (listings / marketplace) will appear here in future versions.
        </p>
      </div>
      <BottomNav />
    </>
  );
}



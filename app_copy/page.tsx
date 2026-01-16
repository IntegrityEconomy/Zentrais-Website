import { Suspense } from 'react';
import MarketplaceContent from './components/MarketplaceContent';

export default function MarketplaceHome() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F6EEE6] text-gray-900 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#F6EEE6] rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}

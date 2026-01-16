import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#1a2332] text-white py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-[#252e3f] rounded-lg p-12 border border-[#1a2332]">
          <h1 className="text-4xl font-bold text-[#ff4d9e] mb-4">Listing Not Found</h1>
          <p className="text-[#b0b8c4] mb-8">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#ff4d9e] hover:bg-[#ff6bb3] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}


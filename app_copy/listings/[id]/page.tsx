import { getListing, getListings } from '../../lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Listing } from '../../types/listing';
import ListingImage from '../../components/ListingImage';
import ListingImageThumbnail from '../../components/ListingImageThumbnail';

interface ListingDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetail({ params }: ListingDetailProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  // Get similar listings (excluding current one)
  const allListings = await getListings();
  const similarListings = allListings
    .filter(l => l.id !== listing.id)
    .slice(0, 3);

  // Use actual data from listing
  const displayPrice = listing.price !== undefined && listing.price !== null 
    ? Math.round(listing.price) 
    : null;
  const categories = Array.isArray(listing.categories) ? listing.categories : [];
  const images = Array.isArray(listing.images) ? listing.images : [];
  const mainImage = images.length > 0 ? images[0] : null;

  return (
    <main className="min-h-screen bg-[#1a2332] text-white pb-24">
      {/* Header */}
      <div className="bg-[#252e3f] border-b border-[#1a2332] px-4 md:px-8 py-4 sticky top-[73px] z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link 
            href="/" 
            className="text-[#b0b8c4] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-white flex-1 truncate">
            {listing.title}
          </h1>
          <button className="text-[#b0b8c4] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
        {/* Product Images */}
        <div className="mb-6">
          {/* Main Image */}
          <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[#3d4560] to-[#1a2332] aspect-square max-h-[500px] flex items-center justify-center">
            <ListingImage 
              src={mainImage} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {/* Pagination dots - only show if multiple images */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Thumbnail Gallery - show if multiple images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#ff6b35] transition-colors cursor-pointer"
                >
                  <ListingImageThumbnail 
                    src={image} 
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        {displayPrice !== null && (
          <div className="mb-6">
            <p className="text-4xl font-bold text-white">${displayPrice}</p>
          </div>
        )}

        {/* Product Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#ff6b35] mb-3">Product Description</h2>
          <p className="text-[#b0b8c4] leading-relaxed whitespace-pre-line">
            {listing.shortDescription}
          </p>
          <button className="text-[#ff6b35] text-sm mt-2 hover:underline">Read more</button>
        </div>

        {/* Category */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Category</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <span 
                  key={index}
                  className="bg-[#3d4560] text-white text-xs px-3 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Seller's Location */}
        {listing.location && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Seller's Location</h2>
            <p className="text-[#b0b8c4]">{listing.location}</p>
          </div>
        )}

        {/* Similar Products */}
        {similarListings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#ff6b35] mb-4">Similar Product</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {similarListings.map((similar) => {
                const similarPrice = similar.price !== undefined && similar.price !== null 
                  ? Math.round(similar.price) 
                  : null;
                const similarImage = similar.images && Array.isArray(similar.images) && similar.images.length > 0 
                  ? similar.images[0] 
                  : null;
                return (
                  <Link
                    key={similar.id}
                    href={`/listings/${similar.id}`}
                    className="flex-shrink-0 w-32"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-[#3d4560] to-[#1a2332] rounded-lg overflow-hidden">
                      {similarImage ? (
                        <img 
                          src={similarImage} 
                          alt={similar.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-full h-full text-[#6b7280] p-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {similarPrice && (
                        <div className="absolute bottom-2 left-2 bg-[#ff6b35] text-white text-xs font-semibold px-2 py-1 rounded">
                          ${similarPrice}
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm mt-2 line-clamp-2">{similar.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Message Seller CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#252e3f] border-t border-[#1a2332] p-4 z-50">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/listings/${listing.id}/message`}
            className="block w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-semibold py-4 px-6 rounded-lg transition-colors text-center"
          >
            Message Seller
          </Link>
        </div>
      </div>
    </main>
  );
}


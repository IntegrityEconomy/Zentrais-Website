'use client';

interface ListingCardImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function ListingCardImage({ src, alt, className = '' }: ListingCardImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load for listing:', alt);
    e.currentTarget.style.display = 'none';
  };

  if (!src) {
    return (
      <>
        <svg className="w-20 h-20 text-[#6b7280] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
}


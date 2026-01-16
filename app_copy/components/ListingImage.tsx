'use client';

interface ListingImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export default function ListingImage({ src, alt, className = '' }: ListingImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', alt);
    e.currentTarget.style.display = 'none';
  };

  if (!src) {
    return (
      <svg className="w-32 h-32 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
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


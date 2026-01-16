'use client';

interface ListingImageThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ListingImageThumbnail({ src, alt, className = '' }: ListingImageThumbnailProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Thumbnail failed to load:', alt);
    e.currentTarget.style.display = 'none';
  };

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


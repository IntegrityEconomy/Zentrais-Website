'use client';

interface VideoYoutubeProps {
  videoId: string;
  controls?: number;
  className?: string;
}

export default function VideoYoutube({ videoId, controls = 1, className = '' }: VideoYoutubeProps) {
  const src = `https://www.youtube.com/embed/${videoId}?controls=${controls}`;

  return (
    <iframe
      className={className}
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}


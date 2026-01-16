import { Heart } from 'lucide-react';
import { Listing } from '../types';
import { cn, formatPrice } from '../utils';

interface ListingCardProps {
  item: Listing;
  liked: boolean;
  onToggleLike: () => void;
  onOpen: () => void;
}

export function ListingCard({ item, liked, onToggleLike, onOpen }: ListingCardProps) {
  return (
    <button type="button" onClick={onOpen} className="w-full text-left">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="relative aspect-[4/3] w-full">
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            aria-label={liked ? 'Unlike' : 'Like'}
            className={cn(
              'absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full',
              'bg-white/70 backdrop-blur',
              'shadow-[0_1px_0_rgba(0,0,0,0.08)] active:scale-95 transition'
            )}
          >
            <Heart className={cn('h-5 w-5', liked ? 'fill-[#B56A1E] text-[#B56A1E]' : 'text-[#B56A1E]')} />
          </button>

          <div
            className={cn(
              'absolute bottom-2 left-2 rounded-md px-2 py-0.5',
              'bg-white/90 text-sm font-semibold text-slate-800',
              'ring-1 ring-black/10'
            )}
          >
            {formatPrice(item.price)}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="truncate text-[13px] font-medium text-slate-700">{item.title}</p>
        <p className="shrink-0 text-[12px] text-slate-500">{item.timeAgo}</p>
      </div>
    </button>
  );
}
import { Listing } from '../types';
import { formatPrice } from '../utils';

interface SearchResultCardProps {
  item: Listing;
  onOpen: () => void;
}

export function SearchResultCard({ item, onOpen }: SearchResultCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left rounded-2xl bg-white px-3 py-3 ring-1 ring-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
    >
      <div className="flex gap-4">
        <div className="relative h-[92px] w-[140px] shrink-0 overflow-hidden rounded-xl">
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[12px] font-semibold text-slate-800 ring-1 ring-black/10">
            {formatPrice(item.price)}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[18px] font-semibold text-slate-800">{item.title}</p>
          <p className="mt-0.5 text-[14px] text-slate-600">{item.subtitle}</p>
          <p className="mt-6 text-[13px] text-slate-500">Posted {item.timeAgo}</p>
        </div>
      </div>
    </button>
  );
}
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Listing } from '../types';
import { cn, formatPrice } from '../utils';

interface ProductDetailScreenProps {
  item: Listing;
  onBack: () => void;
  onMessageSeller: () => void;
}

export function ProductDetailScreen({ item, onBack, onMessageSeller }: ProductDetailScreenProps) {
  const images = item.images?.length ? item.images : [item.imageUrl];
  const categories = item.categories?.length ? item.categories : ['Furniture', 'Antique'];

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const desc =
    item.description ??
    'Lorem ipsum dolor sit amet consectetur. Libero mi senectus malesuada porta convallis metus. Lectus enim et ipsum blandit accumsan. Neque vivamus velit non odio. Vulputate et ornare amet vel ut mauris. Quisque fames tincidunt non rhoncus id tellus id viverra. Sit blandit nisl nec tellus sed sagittis nec. Nulla eget elit lorem lacinia.';

  return (
    <div className="min-h-dvh bg-[#F5EEE6] text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#F5EEE6]/90 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-3 sm:max-w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="grid h-9 w-9 place-items-center rounded-full active:scale-95 transition"
            >
              <ChevronLeft className="h-5 w-5 text-[#B56A1E]" />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-[16px] font-semibold text-slate-800">
              {item.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-md px-4 pb-[calc(110px+env(safe-area-inset-bottom))] sm:max-w-full">
        {/* Responsive layout: stack on mobile, 2-col on landscape/desktop */}
        <div className="sm:grid sm:grid-cols-2 sm:gap-6">
          {/* Image block */}
          <div>
            <div className="relative mt-2 overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={images[index]}
                  alt={`${item.title} ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Dots */}
            {images.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Image ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      'h-2 w-2 rounded-full transition',
                      i === index ? 'bg-slate-700' : 'bg-slate-300'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details block */}
          <div className="mt-6 sm:mt-2">
            {/* Price pill */}
            <div className="my-4">
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[16px] font-semibold text-slate-800 ring-1 ring-black/10">
                {formatPrice(item.price)}
              </span>
            </div>
            <p className="text-[13px] font-semibold text-slate-700">Category</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-white px-3 py-1 text-[12px] text-slate-700 ring-1 ring-black/10"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-[13px] font-semibold text-slate-700">Product Description</p>
              <p className={cn('mt-2 text-[13px] leading-6 text-slate-600', !expanded && 'line-clamp-5')}>
                {desc}
              </p>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 text-[12px] font-semibold text-[#B56A1E]"
              >
                {expanded ? 'Read less' : 'Read more'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#F5EEE6]/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3 sm:max-w-3xl">
          <button
            type="button"
            onClick={onMessageSeller}
            className={cn(
              'w-full rounded-xl py-3 text-[13px] font-semibold',
              'bg-[#B56A1E] text-white shadow-md active:scale-[0.99] transition'
            )}
          >
            Message Seller
          </button>
        </div>
      </div>
    </div>
  );
}
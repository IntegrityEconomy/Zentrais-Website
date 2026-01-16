import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SortBy, FilterDraft } from '../types';
import { cn } from '../utils';
import { RadioRow } from './RadioRow';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  draft: FilterDraft;
  setDraft: React.Dispatch<React.SetStateAction<FilterDraft>>;
  onApply: () => void;
  onClear: () => void;
}

export function FilterModal({ open, onClose, draft, setDraft, onApply, onClear }: FilterModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label="Close filters" onClick={onClose} className="absolute inset-0 bg-black/15" />

      <div className="absolute left-1/2 top-[110px] w-[92%] max-w-[360px] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 active:scale-95 transition"
          >
            <X className="h-4 w-4 text-slate-700" />
          </button>

          <button type="button" onClick={onClear} className="text-[12px] font-medium text-slate-500 hover:text-slate-700">
            Clear All Filters
          </button>
        </div>

        <div className="mt-2">
          <p className="text-[13px] font-semibold text-slate-700">Price Range</p>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-black/10">
              <span className="text-[12px] text-slate-500">Max</span>
              <input
                inputMode="numeric"
                value={draft.maxPriceText}
                onChange={(e) => setDraft((d) => ({ ...d, maxPriceText: e.target.value.replace(/[^\d]/g, '') }))}
                placeholder="0"
                className="w-full bg-transparent text-[13px] text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-black/10">
              <span className="text-[12px] text-slate-500">Min</span>
              <input
                inputMode="numeric"
                value={draft.minPriceText}
                onChange={(e) => setDraft((d) => ({ ...d, minPriceText: e.target.value.replace(/[^\d]/g, '') }))}
                placeholder="0"
                className="w-full bg-transparent text-[13px] text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-slate-700">Sort By</p>

          <div className="mt-2">
            <RadioRow label="Newest Arrivals" checked={draft.sortBy === 'newest'} onClick={() => setDraft((d) => ({ ...d, sortBy: 'newest' }))} />
            <RadioRow label="Price: High to Low" checked={draft.sortBy === 'price_desc'} onClick={() => setDraft((d) => ({ ...d, sortBy: 'price_desc' }))} />
            <RadioRow label="Price: Low to High" checked={draft.sortBy === 'price_asc'} onClick={() => setDraft((d) => ({ ...d, sortBy: 'price_asc' }))} />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-slate-700">Location Radius</p>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[12px] text-slate-600">{draft.radiusMiles}miles</span>
            <input
              type="range"
              min={1}
              max={100}
              value={draft.radiusMiles}
              onChange={(e) => setDraft((d) => ({ ...d, radiusMiles: Number(e.target.value) }))}
              className="w-full accent-[#B56A1E]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onApply}
          className={cn(
            'mt-5 w-full rounded-full py-2.5 text-[13px] font-semibold',
            'bg-[#B56A1E] text-white shadow-md active:scale-[0.99] transition'
          )}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
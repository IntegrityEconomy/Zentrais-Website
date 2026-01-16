import { useState, useEffect, useMemo } from 'react';
import { Filters, FilterDraft, Listing } from '../types';
import { DEFAULT_FILTERS } from '../constants';
import { parseTimeAgoToMinutes } from '../utils';

export function useExchangeFilters(listings: Listing[], query: string) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<FilterDraft>({
    minPriceText: '',
    maxPriceText: '',
    sortBy: 'newest',
    radiusMiles: 10,
  });

  // Update draft when filter modal opens
  useEffect(() => {
    if (!filterOpen) return;
    setDraft({
      minPriceText: appliedFilters.minPrice == null ? '' : String(appliedFilters.minPrice),
      maxPriceText: appliedFilters.maxPrice == null ? '' : String(appliedFilters.maxPrice),
      sortBy: appliedFilters.sortBy,
      radiusMiles: appliedFilters.radiusMiles,
    });
  }, [filterOpen, appliedFilters]);

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = listings.slice();

    if (q) arr = arr.filter((l) => l.title.toLowerCase().includes(q) || l.subtitle.toLowerCase().includes(q));
    if (appliedFilters.minPrice != null) arr = arr.filter((l) => l.price >= appliedFilters.minPrice!);
    if (appliedFilters.maxPrice != null) arr = arr.filter((l) => l.price <= appliedFilters.maxPrice!);

    if (appliedFilters.sortBy === 'price_desc') arr.sort((a, b) => b.price - a.price);
    else if (appliedFilters.sortBy === 'price_asc') arr.sort((a, b) => a.price - b.price);
    else arr.sort((a, b) => parseTimeAgoToMinutes(a.timeAgo) - parseTimeAgoToMinutes(b.timeAgo));

    return arr;
  }, [listings, query, appliedFilters]);

  const applyDraftFilters = () => {
    const minP = draft.minPriceText ? Number(draft.minPriceText) : null;
    const maxP = draft.maxPriceText ? Number(draft.maxPriceText) : null;

    setAppliedFilters({
      minPrice: Number.isFinite(minP as number) ? minP : null,
      maxPrice: Number.isFinite(maxP as number) ? maxP : null,
      sortBy: draft.sortBy,
      radiusMiles: draft.radiusMiles,
    });

    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    setDraft({
      minPriceText: '',
      maxPriceText: '',
      sortBy: DEFAULT_FILTERS.sortBy,
      radiusMiles: DEFAULT_FILTERS.radiusMiles,
    });
    setAppliedFilters(DEFAULT_FILTERS);
    setFilterOpen(false);
  };

  return {
    filterOpen,
    setFilterOpen,
    appliedFilters,
    draft,
    setDraft,
    filteredListings,
    applyDraftFilters,
    clearAllFilters
  };
}
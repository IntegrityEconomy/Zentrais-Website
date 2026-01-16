export type Listing = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  timeAgo: string;
  imageUrl: string;

  // ✅ detail screen fields
  images?: string[];
  categories?: string[]; // e.g. ["Furniture", "Antique"]
  description?: string;
  sellerName?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  isFromMe: boolean;
};

export type SortBy = 'newest' | 'price_desc' | 'price_asc';

export type Filters = {
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortBy;
  radiusMiles: number;
};

export type AIChatMessage = {
  id: string;
  text: string;
  isFromAI: boolean;
  timestamp: string;
  imageResults?: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  }[];
};

export type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
};

export type ExchangeMode = 'grid' | 'search' | 'messaging' | 'sell' | 'detail' | 'location';

export type FilterDraft = {
  minPriceText: string;
  maxPriceText: string;
  sortBy: SortBy;
  radiusMiles: number;
};

export type SellFormData = {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  location: string;
  images: string[];
};
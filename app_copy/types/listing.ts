export interface Listing {
  id: string;
  title: string;
  shortDescription: string;
  proofOrReferenceLink: string;
  credibilityIndicator?: number;
  createdAt?: string;
  updatedAt?: string;
  categories?: string[];
  price?: number;
  location?: string;
  images?: string[]; // Base64 data URLs or image URLs
  sellerName?: string;
  sellerRating?: number;
  sellerJoinedDate?: string;
  sellerAvatar?: string;
}

export interface CreateListingInput {
  title: string;
  shortDescription: string;
  proofOrReferenceLink: string;
  categories?: string[];
  price?: number;
  location?: string;
  images?: string[]; // Base64 data URLs
}


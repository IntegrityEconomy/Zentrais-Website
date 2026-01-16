import { Filters } from '../types';

export const DEFAULT_FILTERS: Filters = {
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  radiusMiles: 10,
};

export const DEFAULT_SELL_FORM = {
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  location: 'Birmingham',
  images: [] as string[]
};

export const DEFAULT_LOCATION = 'Alberta';

export const RECENT_LOCATIONS = ['Toronto', 'Calgary', 'Vancouver'];

export const SAMPLE_CHAT_HISTORIES = [
  { id: '1', title: 'Chat Title', lastMessage: 'Looking for antique tables...', timestamp: 'today' },
  { id: '2', title: 'Chat Title', lastMessage: 'Camera equipment search', timestamp: 'today' },
  { id: '3', title: 'Chat Title', lastMessage: 'Furniture recommendations', timestamp: 'today' },
  { id: '4', title: 'Chat Title', lastMessage: 'Electronics deals', timestamp: 'yesterday' },
  { id: '5', title: 'Chat Title', lastMessage: 'Vintage items query', timestamp: 'yesterday' },
  { id: '6', title: 'Chat Title', lastMessage: 'Pricing advice needed', timestamp: 'yesterday' },
  { id: '7', title: 'Chat Title', lastMessage: 'Local marketplace tips', timestamp: 'lastweek' },
  { id: '8', title: 'Chat Title', lastMessage: 'Negotiation strategies', timestamp: 'lastweek' },
  { id: '9', title: 'Chat Title', lastMessage: 'Best selling practices', timestamp: 'lastweek' },
];

export const SAMPLE_MESSAGES = [
  {
    id: '1',
    text: 'Hi Sarah',
    time: '7:03am',
    isFromMe: true,
  },
  {
    id: '2',
    text: 'Is this product still available',
    time: '7:10pm',
    isFromMe: true,
  },
  {
    id: '3',
    text: 'Hi',
    time: '8:05am',
    isFromMe: false,
  },
  {
    id: '4',
    text: 'Yes it is',
    time: '8:06am',
    isFromMe: false,
  },
];
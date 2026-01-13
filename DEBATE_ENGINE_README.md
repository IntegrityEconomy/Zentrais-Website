# Debate (Perspective) Engine MVP

This is the MVP implementation of the Debate (Perspective) engine for Zentrais. It allows users to create debate topics, post arguments, and vote on topics and posts.

## Features

### ✅ Implemented Features

1. **View Debate Topics** (`/debate`)
   - List all debate topics with support/counter counts
   - Search and filter topics
   - Sort by most/least recent
   - View consensus levels

2. **Create Debate Topic** (`/debate/new`)
   - Create new perspectives with title, description, and tags
   - Word count validation (max 100 words)
   - Form validation

3. **Debate Thread View** (`/debate/[id]`)
   - View topic details
   - See all posts/arguments
   - Post new arguments with position (support/counter/neutral)
   - Vote on topics (Support/Counter)
   - Vote on posts (Agree/Disagree)
   - Real-time updates via mock WebSocket

4. **Voting System**
   - One vote per user per topic/post
   - Support (green) and Counter (red) votes
   - Real-time vote count updates

5. **Real-time Updates**
   - Mock WebSocket client for simulating real-time updates
   - Broadcasts new posts and vote updates

## Project Structure

```
app/
├── debate/
│   ├── page.tsx              # Debate topics list
│   ├── new/
│   │   └── page.tsx          # Create new topic
│   └── [id]/
│       └── page.tsx          # Thread detail view
└── api/
    └── debate/
        ├── topics/
        │   ├── route.ts      # GET/POST topics
        │   └── [id]/
        │       └── route.ts  # GET topic by ID
        └── threads/
            └── [id]/
                ├── route.ts      # GET thread
                ├── posts/
                │   └── route.ts  # POST new post
                └── vote/
                    └── route.ts  # POST vote

components/
└── debate/
    ├── ThreadCard.tsx         # Topic card component
    ├── PostItem.tsx          # Post/argument component
    └── ThoughtEntry.tsx     # Create topic form

hooks/
└── useDebate.ts              # Main hook for debate operations

lib/
├── api/
│   ├── mock-data.ts          # Mock data store and API
│   └── websocket-mock.ts     # Mock WebSocket client
├── types/
│   └── debate.ts             # TypeScript types
└── utils/
    └── date.ts               # Date formatting utilities

backend/
├── README.md                 # Backend architecture docs
├── lambda/                   # AWS Lambda function templates
└── dynamodb/                 # DynamoDB schema definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### Mock API (Current Implementation)

All endpoints are currently using mock data stored in memory:

- `GET /api/debate/topics` - Get all topics
- `GET /api/debate/topics/[id]` - Get topic by ID
- `POST /api/debate/topics` - Create new topic
- `GET /api/debate/threads/[id]` - Get thread (topic + posts)
- `POST /api/debate/threads/[id]/posts` - Create post in thread
- `POST /api/debate/threads/[id]/vote` - Vote on topic or post

### Future AWS Integration

See `backend/README.md` for AWS backend architecture and migration guide.

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  avatar?: string;
}
```

### DebateTopic
```typescript
{
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: User;
  tags?: string[];
  supportCount?: number;
  counterCount?: number;
}
```

### DebatePost
```typescript
{
  id: string;
  threadId: string;
  author: User;
  content: string;
  createdAt: string;
  position?: 'support' | 'counter' | 'neutral';
  supportCount?: number;
  counterCount?: number;
}
```

### Vote
```typescript
{
  userId: string;
  type: 'support' | 'counter';
  postId?: string;
  topicId?: string;
}
```

## Usage Examples

### Creating a Topic

```typescript
const { createTopic } = useDebate();

await createTopic(
  'AI is the Last Major Invention',
  'AI will take over the process of discovery...',
  ['AI', 'Technology', 'Future']
);
```

### Creating a Post

```typescript
const { createPost } = useDebate();

await createPost(
  'thread-id',
  'I believe AI will augment human creativity...',
  'support'
);
```

### Voting

```typescript
const { voteOnTopic, voteOnPost } = useDebate();

// Vote on topic
await voteOnTopic('topic-id', 'support');

// Vote on post
await voteOnPost('post-id', 'thread-id', 'up');
```

## Real-time Updates

The app uses a mock WebSocket client that simulates real-time updates:

```typescript
import { useWebSocket } from '@/lib/api/websocket-mock';

const ws = useWebSocket(threadId);

ws.on('new-post', (data) => {
  // Handle new post
});

ws.on('vote-update', (data) => {
  // Handle vote update
});
```

## Styling

The app uses:
- **Tailwind CSS** for styling
- **Radix UI** components for accessible UI primitives
- **Lucide React** for icons

Components follow the existing design system from the marketing website.

## Testing

See `TESTING.md` for detailed testing instructions.

Test files are located in `__tests__/`:
- Component tests
- Hook tests
- API service tests

## Future Enhancements

1. **AWS Backend Integration**
   - Replace mock data with DynamoDB
   - Implement real WebSocket connections
   - Add authentication with AWS Cognito

2. **Additional Features**
   - User profiles
   - Notifications
   - Rich text editing
   - Image attachments
   - Topic categories
   - Advanced filtering

3. **Performance**
   - Pagination for topics and posts
   - Infinite scroll
   - Optimistic updates
   - Caching strategies

## Migration to AWS

When ready to migrate to AWS:

1. Set up AWS infrastructure (see `backend/README.md`)
2. Update API calls in `/lib/api/mock-data.ts` to use AWS SDK
3. Replace mock WebSocket with real WebSocket API Gateway
4. Add authentication using AWS Cognito
5. Update environment variables

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Follow existing code style
4. Update documentation

## License

[Your License Here]


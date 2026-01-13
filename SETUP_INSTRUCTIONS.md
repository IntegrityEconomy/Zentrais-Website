# Setup Instructions for Zentrais Debate MVP

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Testing libraries (Jest, React Testing Library)
- UI components (Radix UI)

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Navigate to Debate Pages

- **Debate List**: `http://localhost:3000/debate`
- **Create Topic**: `http://localhost:3000/debate/new`
- **View Thread**: `http://localhost:3000/debate/[id]` (e.g., `/debate/1`)

## Testing the Application

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

#### Debate Topics List (`/debate`)
- [ ] View list of debate topics
- [ ] See support/counter counts for each topic
- [ ] Click on a topic to view details
- [ ] Search for topics
- [ ] Filter topics by sort order
- [ ] Click "New Perspective" button

#### Create Topic (`/debate/new`)
- [ ] Enter topic title
- [ ] Enter topic description
- [ ] Add tags (comma-separated)
- [ ] See word count (max 100 words)
- [ ] Submit form to create topic
- [ ] Cancel button works

#### Thread View (`/debate/[id]`)
- [ ] View topic details
- [ ] See all posts/arguments
- [ ] Vote on topic (Support/Counter)
- [ ] Create new post with position
- [ ] Vote on posts (Agree/Disagree)
- [ ] See real-time updates (simulated)

## Project Structure

```
Zentrias-MVP/
├── app/
│   ├── debate/              # Debate engine pages
│   └── api/debate/          # API route handlers
├── components/
│   └── debate/              # Debate components
├── hooks/
│   └── useDebate.ts         # Main debate hook
├── lib/
│   ├── api/                 # Mock API services
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── backend/                 # AWS backend structure (future)
└── __tests__/               # Test files
```

## Key Features

### ✅ Implemented

1. **View Debate Topics**
   - List all topics with metadata
   - Search and filter
   - Support/Counter counts
   - Consensus levels

2. **Create Topics**
   - Form with validation
   - Word count limit (100 words)
   - Tag support

3. **Thread View**
   - Topic details
   - All posts/arguments
   - Voting on topics and posts
   - Real-time updates (mock)

4. **Voting System**
   - One vote per user
   - Support (green) / Counter (red)
   - Real-time count updates

## Mock Data

The app currently uses in-memory mock data. This includes:

- **4 sample topics** (pre-populated)
- **Sample posts** for topic ID "1"
- **Mock users** for testing

All data is stored in `/lib/api/mock-data.ts` and persists only during the session.

## Real-time Updates

The app includes a mock WebSocket client that simulates real-time updates:

- New posts are broadcast to open threads
- Vote updates are broadcast
- Updates appear without page refresh

This is simulated using event emitters and can be replaced with real WebSocket connections when migrating to AWS.

## API Endpoints

All endpoints are available at `/api/debate/*`:

- `GET /api/debate/topics` - List all topics
- `GET /api/debate/topics/[id]` - Get topic by ID
- `POST /api/debate/topics` - Create new topic
- `GET /api/debate/threads/[id]` - Get thread (topic + posts)
- `POST /api/debate/threads/[id]/posts` - Create post
- `POST /api/debate/threads/[id]/vote` - Vote on topic/post

## Environment Setup

No environment variables are required for the MVP. When migrating to AWS, you'll need:

```env
AWS_REGION=us-east-1
AWS_API_GATEWAY_URL=https://api.zentrais.com
AWS_WEBSOCKET_URL=wss://api.zentrais.com/debate
AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxx
AWS_COGNITO_CLIENT_ID=xxxxx
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Test Errors

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose
```

## Next Steps

1. **Test the application** using the checklist above
2. **Review the code** in `/app/debate`, `/components/debate`, and `/hooks`
3. **Read documentation**:
   - `DEBATE_ENGINE_README.md` - Feature documentation
   - `TESTING.md` - Testing guide
   - `backend/README.md` - AWS migration guide

## Support

For issues or questions:
1. Check the documentation files
2. Review test files for usage examples
3. Check console for errors

## Development Tips

1. **Hot Reload**: Changes to components/pages auto-reload
2. **TypeScript**: Use TypeScript for type safety
3. **Testing**: Write tests alongside features
4. **Components**: Reuse existing UI components from `/components/ui`


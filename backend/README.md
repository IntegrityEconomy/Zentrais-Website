# Backend Structure for AWS Integration

This directory contains the structure and documentation for the future AWS backend implementation.

## Architecture Overview

The backend will be built on AWS using:
- **API Gateway** - REST API endpoints
- **Lambda Functions** - Serverless compute for business logic
- **DynamoDB** - NoSQL database for debate data
- **WebSocket API** - Real-time updates via API Gateway WebSocket
- **Cognito** - User authentication and authorization
- **S3** - File storage (avatars, attachments)

## Directory Structure

```
backend/
├── lambda/
│   ├── debate-topics/
│   │   ├── get-topics.ts
│   │   ├── create-topic.ts
│   │   └── get-topic.ts
│   ├── debate-posts/
│   │   ├── get-posts.ts
│   │   └── create-post.ts
│   ├── debate-votes/
│   │   └── vote.ts
│   └── websocket/
│       └── connection-handler.ts
├── dynamodb/
│   ├── schemas/
│   │   ├── topics-table.json
│   │   ├── posts-table.json
│   │   └── votes-table.json
│   └── migrations/
├── infrastructure/
│   ├── cloudformation/
│   │   └── template.yaml
│   └── terraform/
│       └── main.tf
└── scripts/
    └── deploy.sh
```

## Database Schema (DynamoDB)

### Topics Table
- **Partition Key**: `topicId` (String)
- **Sort Key**: None
- **Attributes**: title, description, authorId, createdAt, tags, supportCount, counterCount

### Posts Table
- **Partition Key**: `threadId` (String)
- **Sort Key**: `postId` (String)
- **Attributes**: content, authorId, createdAt, position, supportCount, counterCount

### Votes Table
- **Partition Key**: `entityId` (String) - topicId or postId
- **Sort Key**: `userId` (String)
- **Attributes**: type (support/counter), createdAt

### Users Table (Cognito + DynamoDB)
- Managed by AWS Cognito
- Additional profile data in DynamoDB

## API Endpoints

### Topics
- `GET /api/debate/topics` - List all topics
- `GET /api/debate/topics/{id}` - Get topic by ID
- `POST /api/debate/topics` - Create new topic

### Threads
- `GET /api/debate/threads/{id}` - Get thread (topic + posts)
- `POST /api/debate/threads/{id}/posts` - Create post in thread
- `POST /api/debate/threads/{id}/vote` - Vote on topic or post

### WebSocket
- `wss://api.zentrais.com/debate` - WebSocket connection for real-time updates

## Migration Guide

When migrating from mock data to AWS:

1. **Update API calls** in `/lib/api/` to use actual HTTP requests
2. **Replace mock data** in `/lib/api/mock-data.ts` with AWS SDK calls
3. **Update WebSocket client** to use real WebSocket connection
4. **Add authentication** using AWS Cognito
5. **Update environment variables** for AWS credentials

## Environment Variables

```env
AWS_REGION=us-east-1
AWS_API_GATEWAY_URL=https://api.zentrais.com
AWS_WEBSOCKET_URL=wss://api.zentrais.com/debate
AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxx
AWS_COGNITO_CLIENT_ID=xxxxx
DYNAMODB_TOPICS_TABLE=zentrais-topics
DYNAMODB_POSTS_TABLE=zentrais-posts
DYNAMODB_VOTES_TABLE=zentrais-votes
```

## Next Steps

1. Set up AWS account and IAM roles
2. Create DynamoDB tables
3. Implement Lambda functions
4. Set up API Gateway
5. Configure WebSocket API
6. Set up Cognito for authentication
7. Update frontend to use AWS endpoints


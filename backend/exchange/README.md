# Exchange Backend

Zentrais Marketplace Backend API - handles listings, search, and user interactions.

## Unified Authentication

This service uses **unified JWT authentication** with the Dialogue backend. Both services share the same `JWT_SECRET` so tokens issued by Dialogue are valid for Exchange API calls.

### How It Works

1. **User logs in** via the frontend → calls Dialogue backend `/auth/login`
2. **Dialogue issues JWT** with payload `{ userId: "..." }`
3. **Frontend stores token** in `localStorage` as `auth_token`
4. **Exchange API calls** include `Authorization: Bearer <token>` header
5. **Exchange validates** the JWT using the same `JWT_SECRET`

### JWT Payload Compatibility

The auth middleware accepts both formats:
- Dialogue format: `{ userId: "uuid" }`
- Legacy Exchange format: `{ user_id: "uuid", role: "user" }`

## Setup

```bash
# Copy environment file
cp env.example .env

# IMPORTANT: Set JWT_SECRET to match Dialogue backend
# Edit .env and set the same JWT_SECRET value

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_URI` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | **Must match Dialogue backend** | Yes |
| `PORT` | Server port (default: 3002) | No |

## API Endpoints

### Public Endpoints
- `GET /api/feed` - Paginated listing feed
- `GET /api/feed/search?q=query` - Search listings
- `GET /api/feed/for-you?lat=X&lng=Y` - Location-based feed
- `GET /api/listings/:id` - Get single listing

### Protected Endpoints (require JWT)
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `GET /api/users/:userId/saved-listings` - Get saved listings
- `POST /api/users/:userId/saved-listings/:listingId` - Save listing
- `DELETE /api/users/:userId/saved-listings/:listingId` - Unsave listing

## Architecture

```
Frontend (Next.js)
    │
    ├── /api/auth/* → Dialogue Backend (NestJS)
    │                  └── Issues JWT with { userId }
    │
    └── /api/exchange/* or direct → Exchange Backend (Express)
                                     └── Validates same JWT
```

# Database Schema Merge Guide

This document explains how to merge the two separate database schemas (dialogue and exchange) into a single unified database.

## Overview

Previously, the project had two separate databases:
1. **Dialogue Database** (Prisma) - For messaging, AI conversations
2. **Exchange Database** (Sequelize) - For marketplace listings, user profiles

Now, both are unified into a single PostgreSQL database with three schemas:
- `core` - Shared user identity and PII
- `dialog` - Messaging and AI conversations
- `exchange` - Marketplace listings and profiles

## Unified Schema Location

The canonical schema is at: `backend/prisma/schema.prisma`

Both services should reference this schema or have a copy of it.

## Migration Steps

### Step 1: Update Environment Variables

Both services should use the same `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@host:5432/zentrais?schema=public"
```

### Step 2: Install Prisma in Exchange Backend

```bash
cd backend/exchange
npm install @prisma/client
npm install -D prisma
```

### Step 3: Generate Prisma Client

From the exchange directory:
```bash
npx prisma generate
```

Or from the root backend directory:
```bash
cd backend/prisma
npx prisma generate
```

### Step 4: Run Migration

From the main prisma directory:
```bash
cd backend/prisma
npx prisma migrate dev --name merge_schemas
```

This will:
1. Create the `exchange` schema in PostgreSQL
2. Add the new tables (profiles, listings, saved_listings)
3. Add new columns to the users table (role, account_status)

### Step 5: Update Exchange Backend Code

Replace Sequelize imports with Prisma:

**Before (Sequelize):**
```javascript
const User = require('./models/User');
const user = await User.findByPk(userId);
```

**After (Prisma):**
```javascript
const prisma = require('./config/prisma');
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### Step 6: Update Exchange Routes/Controllers

#### Example: Get User Profile

**Before:**
```javascript
const Profile = require('../models/Profile');
const profile = await Profile.findOne({ where: { user_id: userId } });
```

**After:**
```javascript
const prisma = require('../config/prisma');
const profile = await prisma.profile.findUnique({ 
  where: { user_id: userId },
  include: { user: true }
});
```

#### Example: Create Listing

**Before:**
```javascript
const Listing = require('../models/Listing');
const listing = await Listing.create({
  seller_id: userId,
  title: 'My Item',
  price: 99.99
});
```

**After:**
```javascript
const prisma = require('../config/prisma');
const listing = await prisma.listing.create({
  data: {
    seller_id: userId,
    title: 'My Item',
    price: 99.99
  }
});
```

## Query Comparison Cheat Sheet

| Operation | Sequelize | Prisma |
|-----------|-----------|--------|
| Find by ID | `Model.findByPk(id)` | `prisma.model.findUnique({ where: { id } })` |
| Find one | `Model.findOne({ where })` | `prisma.model.findFirst({ where })` |
| Find all | `Model.findAll({ where })` | `prisma.model.findMany({ where })` |
| Create | `Model.create(data)` | `prisma.model.create({ data })` |
| Update | `Model.update(data, { where })` | `prisma.model.update({ where, data })` |
| Delete | `Model.destroy({ where })` | `prisma.model.delete({ where })` |
| Include | `{ include: [Association] }` | `{ include: { relation: true } }` |

## Benefits of Unified Database

1. **Single Connection** - One database connection pool instead of two
2. **Data Integrity** - Foreign keys between dialogue and exchange tables
3. **Unified Users** - One user table shared across all features
4. **Simpler Deployment** - Only one database to provision and maintain
5. **Consistent ORM** - Prisma across all services

## Cleanup

After migration is complete and tested:

1. Remove Sequelize dependencies from exchange:
   ```bash
   npm uninstall sequelize sequelize-typescript pg-hstore
   ```

2. Delete old Sequelize models:
   - `backend/exchange/models/User.js`
   - `backend/exchange/models/Profile.js`
   - `backend/exchange/models/Listing.js`
   - `backend/exchange/models/SavedListing.js`
   - `backend/exchange/config/db.js`

3. Update `server.js` to remove Sequelize sync:
   ```javascript
   // Remove this:
   sequelize.sync({ alter: true })
   ```

## Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE SCHEMA                               │
├─────────────────────────────────────────────────────────────────┤
│  users                          user_pii                         │
│  ├── id (PK)                    ├── user_id (PK, FK)            │
│  ├── username                   ├── email                        │
│  ├── email                      ├── phone                        │
│  ├── password                   ├── legal_name                   │
│  ├── role                       └── address                      │
│  └── account_status                                              │
└─────────────────────────────────────────────────────────────────┘
          │                              │
          │ (user_id)                    │
          ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────────────┐
│     DIALOG SCHEMA       │    │       EXCHANGE SCHEMA           │
├─────────────────────────┤    ├─────────────────────────────────┤
│  messages               │    │  profiles                        │
│  ├── sender_id (FK)     │    │  ├── user_id (FK)               │
│  └── receiver_id (FK)   │    │  └── display_name, bio, etc     │
│                         │    │                                  │
│  ai_threads             │    │  listings                        │
│  ├── user_id (FK)       │    │  ├── seller_id (FK)             │
│  └── langgraph_thread_id│    │  └── title, price, etc          │
│                         │    │                                  │
│  ai_messages            │    │  saved_listings                  │
│  └── thread_id (FK)     │    │  ├── user_id (FK)               │
│                         │    │  └── listing_id (FK)            │
└─────────────────────────┘    └─────────────────────────────────┘
```

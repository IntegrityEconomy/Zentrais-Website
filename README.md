This folder is extended from the Dinal/debate repo


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Databases
This repo runs two backends that each use PostgreSQL:

- **Dialogue backend** ([backend/dialogue](backend/dialogue)) uses **Prisma**.
- **Exchange backend** ([backend/exchange](backend/exchange)) uses **Sequelize**.

### 1) Start PostgreSQL

You can use any local Postgres instance. If you want a quick local DB via Docker, you can start the Dialogue repo's Postgres container and reuse it:

```powershell
cd backend/dialogue
docker compose up -d db
```

That creates a Postgres instance on `localhost:5432` with a default database named `chatdb`.

Create the Exchange database (if it doesn't exist yet):

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE exchange_db;"
```

### 2) Dialogue database (Prisma)

Set `DATABASE_URL` in [backend/dialogue/.env](backend/dialogue/.env) (or create it from `env.example`) to point at your Postgres:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chatdb?schema=public
```

Then run:

```bash
cd backend/dialogue
npm install
npm run prisma:generate
npm run prisma:deploy
```

Notes:

- `prisma:generate` only generates the Prisma Client code (it does not create tables).
- `prisma:deploy` applies the existing migrations to your database (recommended for local testing).
- `prisma:migrate` (`prisma migrate dev`) is for creating new migrations during development.

Optional: [backend/dialogue/prisma/full-schema.sql](backend/dialogue/prisma/full-schema.sql) is only for verifying/aligning against the final target schema. You generally do not need to import it for local dev if migrations are working.

### 3) Exchange database (Sequelize)

Create `backend/exchange/.env` from [backend/exchange/env.example](backend/exchange/env.example) and set:

```text
POSTGRES_URI=postgresql://postgres:postgres@localhost:5432/exchange_db
JWT_SECRET=<must match backend/dialogue JWT_SECRET>
```

Then start the server; in development it will auto-create/update tables via Sequelize sync:

```bash
cd backend/exchange
npm install
npm run dev
```


## Add .env file

Please add .env file in the root directoy as follow

```plain
# NEXT_PUBLIC_ is for client.
# Server-side can use either.
# Local dev
DIALOGUE_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_DIALOGUE_BACKEND_URL=http://localhost:3001

EXCHANGE_BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_EXCHANGE_BACKEND_URL=http://localhost:3002

# Production / remote examples (optional)
# DIALOGUE_BACKEND_URL=http://sg-chat-alb-2067960470.us-east-1.elb.amazonaws.com
# NEXT_PUBLIC_DIALOGUE_BACKEND_URL=http://sg-chat-alb-2067960470.us-east-1.elb.amazonaws.com
```

## Full-stack local development (Frontend + Dialogue + Exchange)

Run these in 3 separate terminals.

### 1) Frontend (Next.js)

From the repo root:

```bash
npm install
npm run dev
```

App: http://localhost:3000

### 2) Dialogue backend (NestJS)

From `backend/dialogue`:

```bash
npm install
npm run dev
```

API: http://localhost:3001

### 3) Exchange backend (Express)

From `backend/exchange`:

```bash
npm install
```

Create `backend/exchange/.env` from the example and ensure `JWT_SECRET` matches the Dialogue backend.

- macOS/Linux:

```bash
cp env.example .env
```

- Windows (PowerShell):

```powershell
Copy-Item env.example .env
```

Then start the server:

```bash
npm run dev
```

API: http://localhost:3002

## Getting Started

### Prerequisites

- **Node.js (LTS)** and **npm** installed.
	- Download from: https://nodejs.org/
	- Verify install:
		- `node -v`
		- `npm -v`

### Deploy / run from scratch (after cloning from GitHub)

1) Add the `.env` file (as shown above)

2) Install dependencies

```bash
npm install
```

3) Run the dev server

```bash
npm run dev
```

4) Open the app

- http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Common npm commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`

### Troubleshooting

- If `npm install` fails, delete `node_modules` and `package-lock.json`, then rerun `npm install`.
- If port 3000 is in use, run `npm run dev -- -p 3001` and open http://localhost:3001

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

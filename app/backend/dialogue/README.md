# Chat Engine Team

Lightweight NestJS + Socket.IO chat API backed by Prisma/Postgres, plus a separate LangGraph (FastAPI) service for AI.

This README includes:

- A short product/tech overview (updated to match the current codebase)
- Local development notes
- A full AWS “from scratch” deployment guide (ECS Fargate + ALB + RDS Postgres + S3 + ECR + Secrets Manager + Cloud Map)

## Tech Stack

- NestJS 10 (Express + Socket.IO)
- Prisma ORM (PostgreSQL)
- PostgreSQL (RDS on AWS, or local Postgres for dev)
- AWS S3 (media storage, served via pre-signed URLs)
- LangGraph agent service (FastAPI)

## What the system does

### Chat + Auth

- `POST /auth/register` and `POST /auth/login` return a JWT.
- Socket.IO is authenticated via the JWT and emits/receives real-time messages.

### AI (LangGraph)

- `POST /ai/chat` proxies requests to the LangGraph service configured by `LANGGRAPH_URL`.
- AI threads/messages are stored in Postgres (`AiThread`, `AiMessage`).

## How it works (code walkthrough)

This repo is two services that work together:

- **chat-api (NestJS)**: auth + realtime chat + message persistence + S3 media upload + AI proxy.
- **langgraph-agent (FastAPI)**: the actual AI agent that produces responses + emotion output and maintains in-memory session state.

Below is the request/logic flow, mapped to the actual source files.

### 1) Authentication (JWT)

Goal: identify the user across HTTP and Socket.IO.

- HTTP endpoints:
  - `POST /auth/register` and `POST /auth/login` are implemented in `src/auth/auth.controller.ts`.
  - Password hashing is done with bcrypt in `src/auth/auth.service.ts`.
- JWT creation:
  - `AuthService.signToken(userId)` signs `{ userId }` using the secret in `src/auth/auth.module.ts`.

Important implementation detail: this codebase currently validates JWTs manually (via `JwtService.verify(...)`) in each controller/gateway that needs it, rather than using a Nest Guard/Passport strategy.

### 2) Realtime chat (Socket.IO)

Goal: send a message and deliver it in realtime to just the sender + receiver.

Core file: `src/chat/chat.gateway.ts`.

Connection flow:

1. The browser connects with `socket.handshake.auth.token` set.
2. `handleConnection()` verifies the JWT, stores `socket.data.userId`, and joins the user’s private room named by that userId.
3. Any invalid/missing token disconnects the socket.

Message flow (event: `send_message`):

1. Client emits `send_message` with `{ receiverId, type, content?, mediaUrl? }`.
2. The gateway reads `senderId` from `socket.data.userId`.
3. It persists the message via `ChatService.saveMessage(...)` in `src/chat/chat.service.ts` (Prisma → Postgres).
4. If the message is media (IMAGE/AUDIO), it converts the stored S3 key into a **pre-signed GET URL** using `UploadService.getPresignedUrl(...)`.
5. It emits `receive_message` to both rooms: `senderId` and `receiverId`.

This achieves private 1:1 delivery without broadcasting to all clients.

### 3) Media upload + secure playback (S3)

Goal: upload image/audio files to S3, store only a key in DB, and give time-limited access URLs.

Upload endpoint: `POST /upload/media` in `src/upload/upload.controller.ts`.

Flow:

1. Client sends multipart form-data with the file plus `{ receiverId, type }`.
2. Controller verifies the `Authorization: Bearer <JWT>` header and derives `senderId` from the token.
3. It calls `UploadService.uploadFile(...)` in `src/upload/upload.service.ts`.
4. `uploadFile()` writes the object to S3 using a structured key:

   `senderId/receiverId/type/YYYY/MM/DD/HHmmss_<uuid>_<originalname>`

5. The API response returns `{ mediaKey }` (the S3 key). The client then sends a chat message containing this key.

When reading messages (realtime or history), the server turns `mediaKey` into a pre-signed URL via `getPresignedUrl()` so the browser can download the object without making the bucket public.

### 4) Message history + chat list (REST)

Goal: fetch past messages and a chat list derived from the latest message per conversation.

Core files:

- `src/message/message.controller.ts`
- `src/message/message.service.ts`

Endpoints:

- `GET /messages/:userId`
  - Queries all messages where the user is either sender or receiver.
  - Orders ascending by `createdAt`.
  - For media messages, converts stored S3 keys to pre-signed URLs.

- `GET /messages/chats/:userId`
  - Pulls all messages involving the user ordered by newest first.
  - Reduces them to “latest message per other user”.
  - Looks up usernames in bulk.
  - Returns a chat list summary (last message preview/time/type).

### 5) AI proxy + persistence (NestJS → LangGraph)

Goal: expose an AI endpoint from the same API, but run the AI agent separately and keep thread history.

HTTP endpoints are in `src/ai/ai.controller.ts` and logic in `src/ai/ai.service.ts`.

`POST /ai/chat` flow:

1. The controller verifies JWT and derives `userId`.
2. The service picks the LangGraph URL from `process.env.LANGGRAPH_URL`.
3. It forwards the request to the agent:
   - Input: `{ message, user_id, thread_id? }`
   - If the client passed a chat-api `threadId`, the service maps it to `AiThread.langgraphThreadId` before calling LangGraph.
4. On success, LangGraph returns `{ response, emotion, thread_id }`.
5. The service upserts/creates `AiThread` (owned by `userId`) and writes two `AiMessage` rows:
   - USER: the user’s prompt
   - ASSISTANT: the model response + emotion fields
6. Response returns `threadId` as the chat-api thread id (not the LangGraph thread id).

Thread endpoints:

- `GET /ai/threads` lists `AiThread` rows for the user.
- `GET /ai/threads/:threadId` returns a thread + ordered `AiMessage` history.
- `POST /ai/reset` forwards to LangGraph `/reset` for that `userId` (and optional thread) and returns a simple status.

### 6) LangGraph agent service (FastAPI)

Goal: run the AI agent with session/thread memory and return structured output.

Core file: `LangGraph_Chat/server.py`.

- `/chat` accepts `{ message, user_id?, thread_id? }`.
- It creates or reuses an in-memory `ChatEngine` session keyed by `(user_id, thread_id)`.
- It calls `engine.achat(message)` and returns:
  - `response`: assistant text
  - `emotion`: a dict produced by the agent pipeline
  - `thread_id`: the agent’s thread identifier

Important runtime detail: sessions are stored **in memory** in the LangGraph service process (`_sessions` dict). If the service restarts, in-memory sessions reset (the chat-api still persists conversation transcripts to Postgres).

### 7) Data model (Prisma)

Goal: persist users, chat messages, and AI conversation history.

Prisma models are in `prisma/schema.prisma`:

- `User`: account identity.
- `Message`: 1:1 chat messages, with `type` (TEXT/IMAGE/AUDIO) and optional `mediaUrl` which is actually an S3 key.
- `AiThread`: per-user AI conversation threads; stores `langgraphThreadId` to map between services.
- `AiMessage`: AI transcript messages (USER/ASSISTANT) plus optional emotion fields.

## Project Layout

```
src/                   # NestJS app (chat-api)
  ai/                  # /ai endpoints + proxy to LangGraph
  auth/                # /auth endpoints (JWT)
  chat/                # Socket.IO gateway
  message/             # message REST endpoints
  upload/              # S3 media upload endpoints
  zentrais_client.html # browser demo client

LangGraph_Chat/        # FastAPI/LangGraph service (langgraph-agent)
prisma/                # Prisma schema + migrations
docker-compose.yml     # optional local dev stack
Dockerfile             # chat-api image
LangGraph_Chat/Dockerfile  # langgraph-agent image
```

## Local development (optional)

### Requirements

- Node.js 18+
- Docker Desktop (optional, for local Postgres)
- Python 3.11+ (only if you run LangGraph locally)

### Environment

Create a local `.env` (do not commit it):

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chatdb?schema=public
JWT_SECRET=dev-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-dev-bucket
LANGGRAPH_URL=http://localhost:8000
```

### Run chat-api (NestJS)

```powershell
npm install
npm run prisma:generate
npm run build
npm run start:dev
```

### Run langgraph-agent locally

```powershell
cd LangGraph_Chat
pip install -r requirements.txt
setx OPENAI_API_KEY "<your key>"
python server.py
```

Or via Docker (if you prefer):

```powershell
docker build -t langgraph-agent ./LangGraph_Chat
docker run -p 8000:8000 -e OPENAI_API_KEY="<your key>" langgraph-agent
```

### Demo client

Open `src/zentrais_client.html` in a browser and set the API Base URL to your server.

## Architecture

- **Public**: ALB (HTTP/HTTPS) → ECS Service `chat-api` (port 3000, supports WebSockets)
- **Internal**: ECS Service `langgraph-agent` (port 8000, no ALB) reachable via **Cloud Map** DNS
- **Data**: RDS Postgres (Prisma), S3 bucket (media)
- **Secrets**: AWS Secrets Manager (`DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, optional `TAVILY_API_KEY`)

### Current endpoints

- Public API base URL (ALB DNS):
  - `http://sg-chat-alb-2067960470.us-east-1.elb.amazonaws.com`
- Internal service discovery URL (inside the VPC):
  - `http://langgraph.chat-engine.local:8000`

## Required environment variables

### chat-api (NestJS)

- `DATABASE_URL` (secret) — **must be a plain Postgres URL string**
- `JWT_SECRET` (secret)
- `AWS_REGION` (env)
- `AWS_S3_BUCKET` (env)
- `LANGGRAPH_URL` (env) — Cloud Map URL, e.g. `http://langgraph.chat-engine.local:8000`
- `PORT` (optional) — defaults to `3000`

### langgraph-agent (FastAPI/LangGraph)

- `OPENAI_API_KEY` (secret)
- `TAVILY_API_KEY` (optional secret, only needed if you use Tavily tools)
- `PORT` (optional) — defaults to `8000`

Important: if your Secrets Manager secret value is JSON (e.g. `{ "OPENAI_API_KEY": "..." }`) you must reference the JSON key in the task definition:

```
valueFrom = arn:aws:secretsmanager:REGION:ACCOUNT:secret:chat-engine/OPENAI_API_KEY-XXXXX:OPENAI_API_KEY::
```

The simplest approach is to store `OPENAI_API_KEY` as a **plain string** secret instead.

## AWS setup (from scratch)

This guide assumes:

- Region: `us-east-1`
- You are using the **default VPC** (simplest to start)

### 0) Prereqs (Windows)

- AWS CLI v2
- Docker Desktop

Confirm identity:

```powershell
aws sts get-caller-identity
```

### 1) Create ECR repositories

```powershell
aws ecr create-repository --repository-name chat-api --region us-east-1
aws ecr create-repository --repository-name langgraph-agent --region us-east-1
```

Login Docker to ECR:

```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

Build + push images:

```powershell
# chat-api
docker build -t chat-api .
docker tag chat-api:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/chat-api:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/chat-api:latest

# langgraph-agent
docker build -t langgraph-agent ./LangGraph_Chat
docker tag langgraph-agent:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/langgraph-agent:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/langgraph-agent:latest
```

Troubleshooting: if `docker login` to ECR fails with proxy errors, check Docker Desktop proxy settings and add `*.amazonaws.com` to the proxy bypass/no-proxy list.

### 2) Networking (default VPC + 2 subnets)

Find default VPC:

```powershell
$vpc = aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query "Vpcs[0].VpcId" --output text
$vpc
```

List subnets (choose 2 in different AZs):

```powershell
aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpc --query "Subnets[].{id:SubnetId,az:AvailabilityZone}" --output table
```

### 3) Security Groups

Create three security groups (Console is easiest):

- **ALB SG** inbound: 80/443 from `0.0.0.0/0`
- **ECS SG** inbound:
  - TCP 3000 from ALB SG
  - TCP 8000 from ECS SG (for chat-api → langgraph-agent)
- **RDS SG** inbound:
  - TCP 5432 from ECS SG

### 4) Create RDS Postgres

Console: RDS → Create database

- Engine: PostgreSQL
- Public access: **No** (recommended)
- VPC: default VPC
- SG: RDS SG
- DB name: `chatdb`

Create `DATABASE_URL`:

```
postgresql://postgres:<PASSWORD>@<RDS_ENDPOINT>:5432/chatdb?schema=public
```

### 5) Create S3 bucket

- Bucket name: `chat-engine-multimedia-<unique>`
- Block public access: ON

### 6) Create ECS cluster

Console: ECS → Clusters → Create cluster

- Networking only (Fargate)
- Name: `chat-engine-cluster`

### 7) Create Cloud Map namespace

Console: ECS → your cluster → Service discovery → Create namespace

- Namespace name: `chat-engine.local`

Later we use `langgraph` as the service name, giving:

- `http://langgraph.chat-engine.local:8000`

### 8) Create Secrets (Secrets Manager)

Create these secrets:

- `chat-engine/DATABASE_URL` (plain string)
- `chat-engine/JWT_SECRET` (plain string)
- `chat-engine/OPENAI_API_KEY` (plain string recommended)
- `chat-engine/TAVILY_API_KEY` (optional)

### 9) ECS task definitions

#### A) langgraph-agent task

- Container: `langgraph-agent` image
- Port: 8000
- Secrets:
  - `OPENAI_API_KEY`
  - `TAVILY_API_KEY` (if used)
- Logs: CloudWatch

Notes:

- Your **task execution role** must be allowed to read these secrets (`secretsmanager:GetSecretValue`).

#### B) chat-api task

- Container: `chat-api` image
- Port: 3000
- Environment:
  - `AWS_REGION`
  - `AWS_S3_BUCKET`
  - `LANGGRAPH_URL=http://langgraph.chat-engine.local:8000`
- Secrets:
  - `DATABASE_URL`
  - `JWT_SECRET`

### 10) ECS services

#### A) Create internal langgraph-agent service

- Desired tasks: 1
- Public IP: Enabled/Disabled both work; recommended is private subnets + NAT, but default VPC with public IP is simplest.
- Service discovery: enable, service name `langgraph`

#### B) Create chat-api service behind an ALB

- Desired tasks: 1
- ALB target group: **IP target type**, port 3000
- Health check path: `/health`
- Listener: HTTP 80 (add HTTPS later with ACM)

WebSockets: works behind ALB. If you scale to >1 task, enable target group stickiness or add a Socket.IO Redis adapter.

### 11) Run Prisma migrations (required)

If your RDS is private, run migrations as a **one-off ECS task** using the chat-api task definition:

Override command:

```powershell
npx prisma migrate deploy
```

Optional seed:

```powershell
npm run prisma:seed
```

## Testing

### Health

```text
GET /health  -> 200 OK
```

### Demo client

Open `src/zentrais_client.html` in your browser.

- Set API Base URL to your ALB DNS name
- Register/login to get JWT
- Connect Socket.IO and send messages
- Use AI section (requires LangGraph + valid OpenAI key)

## Troubleshooting

### `/ai/chat` returns 500

Most common causes:

- `LANGGRAPH_URL` is wrong or LangGraph service is down
- `OPENAI_API_KEY` secret is invalid or injected incorrectly (JSON secret without `:KEY::` mapping)
- ECS execution role lacks `secretsmanager:GetSecretValue`

### Prisma errors like “table does not exist”

- Migrations were not deployed to RDS. Run `npx prisma migrate deploy` as a one-off ECS task.

## Scripts

- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:deploy` — deploy migrations (safe for CI/ECS one-off)



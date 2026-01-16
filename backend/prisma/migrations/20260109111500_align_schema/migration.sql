
-- This migration aligns the database with the current Prisma schema.

-- CreateEnum
DO $$
BEGIN
	CREATE TYPE "AiMessageRole" AS ENUM ('USER', 'ASSISTANT');
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "AiThread" (
	"id" TEXT NOT NULL,
	"userId" TEXT NOT NULL,
	"title" TEXT,
	"langgraphThreadId" TEXT NOT NULL,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "AiThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AiMessage" (
	"id" TEXT NOT NULL,
	"threadId" TEXT NOT NULL,
	"role" "AiMessageRole" NOT NULL,
	"content" TEXT NOT NULL,
	"emotionScore" INTEGER,
	"emotionLabel" TEXT,
	"emotionReasoning" TEXT,
	"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
DO $$
BEGIN
	CREATE UNIQUE INDEX "AiThread_langgraphThreadId_key" ON "AiThread"("langgraphThreadId");
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
	CREATE INDEX "AiThread_userId_updatedAt_idx" ON "AiThread"("userId", "updatedAt");
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
	CREATE INDEX "AiMessage_threadId_createdAt_idx" ON "AiMessage"("threadId", "createdAt");
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
	ALTER TABLE "AiThread" ADD CONSTRAINT "AiThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
	ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "AiThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

-- Add missing receiver foreign key on Message
DO $$
BEGIN
	ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
	WHEN duplicate_object THEN NULL;
END $$;

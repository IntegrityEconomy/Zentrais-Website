/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_hash]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AiThread" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "email_hash" TEXT,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "org_default_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Backfill required User fields for existing rows
UPDATE "User"
SET
  "created_at" = COALESCE("created_at", "createdAt", CURRENT_TIMESTAMP),
  "updated_at" = COALESCE("updated_at", "createdAt", CURRENT_TIMESTAMP),
  "email" = COALESCE("email", ("username" || '@local.invalid'))
WHERE
  "email" IS NULL
  OR "created_at" IS NULL
  OR "updated_at" IS NULL;

UPDATE "User"
SET
  "email_hash" = COALESCE("email_hash", md5("email"))
WHERE
  "email_hash" IS NULL;

-- Enforce required constraints after backfill
ALTER TABLE "User" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "email_hash" SET NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "User_PII" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "legal_name" TEXT,
    "address" TEXT,

    CONSTRAINT "User_PII_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
DO $$
BEGIN
  CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateIndex
DO $$
BEGIN
  CREATE UNIQUE INDEX "User_email_hash_key" ON "User"("email_hash");
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "User_PII" ADD CONSTRAINT "User_PII_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Backfill User_PII (keeps phone/legal_name/address NULL)
INSERT INTO "User_PII" ("user_id", "email")
SELECT "id", "email" FROM "User"
ON CONFLICT ("user_id") DO NOTHING;

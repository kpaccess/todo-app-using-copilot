/*
  Warnings:

  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Create a default user for existing todos
INSERT INTO "User" ("id", "username", "password", "createdAt", "updatedAt")
VALUES ('default-user-id', 'default', '$2b$10$defaulthashvalue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add the userId column with a default value first
ALTER TABLE "Todo" ADD COLUMN "userId" TEXT DEFAULT 'default-user-id';

-- Update all existing todos to belong to the default user
UPDATE "Todo" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;

-- Remove the default value and make the column NOT NULL
ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Todo" ALTER COLUMN "userId" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

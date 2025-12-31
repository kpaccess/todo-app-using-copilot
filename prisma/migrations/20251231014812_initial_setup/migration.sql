-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Todo_date_idx" ON "Todo"("date");

-- CreateIndex
CREATE INDEX "Todo_completed_idx" ON "Todo"("completed");

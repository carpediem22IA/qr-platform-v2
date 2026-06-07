-- CreateEnum
CREATE TYPE "QRStatus" AS ENUM ('ACTIVE', 'USED');

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "batchNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printedAt" TIMESTAMP(3),
    "shareToken" TEXT,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qrs" (
    "id" TEXT NOT NULL,
    "qrNumber" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "status" "QRStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "batchId" TEXT NOT NULL,

    CONSTRAINT "qrs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "batches_batchNumber_key" ON "batches"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "batches_shareToken_key" ON "batches"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "qrs_qrNumber_key" ON "qrs"("qrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "qrs_token_key" ON "qrs"("token");

-- AddForeignKey
ALTER TABLE "qrs" ADD CONSTRAINT "qrs_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

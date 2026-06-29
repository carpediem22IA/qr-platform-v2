-- CreateTable
CREATE TABLE "BatchBackup" (
    "id" TEXT NOT NULL,
    "batchNumber" INTEGER NOT NULL,
    "data" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchBackup_pkey" PRIMARY KEY ("id")
);

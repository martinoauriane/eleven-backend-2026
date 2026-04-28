/*
  Warnings:

  - You are about to drop the column `statusUpdatedAt` on the `OnMap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OnMap" DROP COLUMN "statusUpdatedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3);

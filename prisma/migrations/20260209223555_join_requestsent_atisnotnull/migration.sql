/*
  Warnings:

  - Made the column `sentAt` on table `JoinRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JoinRequest" ALTER COLUMN "sentAt" SET NOT NULL;

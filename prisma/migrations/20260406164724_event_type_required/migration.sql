/*
  Warnings:

  - Made the column `eventType` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "eventName" DROP DEFAULT,
ALTER COLUMN "eventType" SET NOT NULL,
ALTER COLUMN "eventType" SET DEFAULT 'Drinks with friends';

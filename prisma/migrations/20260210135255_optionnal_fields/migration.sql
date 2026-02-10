/*
  Warnings:

  - Made the column `eventLat` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventLon` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "eventLat" SET NOT NULL,
ALTER COLUMN "eventLon" SET NOT NULL,
ALTER COLUMN "eventType" DROP NOT NULL;

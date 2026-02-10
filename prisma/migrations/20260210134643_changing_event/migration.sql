/*
  Warnings:

  - You are about to drop the column `partyAddress` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `partyCoords` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `partyPictures` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `partyTags` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `partyType` on the `Event` table. All the data in the column will be lost.
  - Added the required column `eventAddress` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "partyAddress",
DROP COLUMN "partyCoords",
DROP COLUMN "partyPictures",
DROP COLUMN "partyTags",
DROP COLUMN "partyType",
ADD COLUMN     "eventAddress" TEXT NOT NULL,
ADD COLUMN     "eventLat" DOUBLE PRECISION,
ADD COLUMN     "eventLon" DOUBLE PRECISION,
ADD COLUMN     "eventPictures" TEXT[],
ADD COLUMN     "eventTags" TEXT[],
ADD COLUMN     "eventType" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `partyLng` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "partyLng",
ADD COLUMN     "isOnMap" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partyLon" DOUBLE PRECISION,
ADD COLUMN     "userLat" DOUBLE PRECISION,
ADD COLUMN     "userLon" DOUBLE PRECISION,
ALTER COLUMN "homeAddress" DROP NOT NULL,
ALTER COLUMN "isOnline" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'Wants to go out',
ALTER COLUMN "lastLogin" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "friendsNumber" SET DEFAULT 0;

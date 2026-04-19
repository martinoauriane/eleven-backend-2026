/*
  Warnings:

  - You are about to drop the column `ActivityType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isOnMap` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partyAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partyLat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `partyLon` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userLat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userLon` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserSituation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSituation" DROP CONSTRAINT "UserSituation_picture_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ActivityType",
DROP COLUMN "isOnMap",
DROP COLUMN "partyAddress",
DROP COLUMN "partyId",
DROP COLUMN "partyLat",
DROP COLUMN "partyLon",
DROP COLUMN "userLat",
DROP COLUMN "userLon";

-- DropTable
DROP TABLE "UserSituation";

-- CreateTable
CREATE TABLE "OnMap" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "activity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnMap_userId_key" ON "OnMap"("userId");

-- AddForeignKey
ALTER TABLE "OnMap" ADD CONSTRAINT "OnMap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

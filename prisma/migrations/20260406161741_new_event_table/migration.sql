/*
  Warnings:

  - You are about to drop the column `city` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventCreatorId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventPictures` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventTags` on the `Event` table. All the data in the column will be lost.
  - Added the required column `eventCity` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventCountry` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_eventCreatorId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "eventCreatorId",
DROP COLUMN "eventPictures",
DROP COLUMN "eventTags",
ADD COLUMN     "eventCity" TEXT NOT NULL,
ADD COLUMN     "eventCountry" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `partyId` on the `EventMembers` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `EventMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventMembers" DROP CONSTRAINT "EventMembers_partyId_fkey";

-- AlterTable
ALTER TABLE "EventMembers" DROP COLUMN "partyId",
ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EventMembers" ADD CONSTRAINT "EventMembers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

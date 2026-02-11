/*
  Warnings:

  - You are about to drop the column `userId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventPeople` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PeoplePartying` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventCreatorId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventPeople" DROP CONSTRAINT "EventPeople_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_PeoplePartying" DROP CONSTRAINT "_PeoplePartying_A_fkey";

-- DropForeignKey
ALTER TABLE "_PeoplePartying" DROP CONSTRAINT "_PeoplePartying_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userId",
ADD COLUMN     "eventCreatorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attendingEventId" INTEGER;

-- DropTable
DROP TABLE "EventPeople";

-- DropTable
DROP TABLE "_PeoplePartying";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_attendingEventId_fkey" FOREIGN KEY ("attendingEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCreatorId_fkey" FOREIGN KEY ("eventCreatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

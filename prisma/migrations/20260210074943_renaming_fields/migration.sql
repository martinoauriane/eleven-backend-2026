/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Party` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_partyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_partyId_fkey";

-- DropForeignKey
ALTER TABLE "_UsersPartying" DROP CONSTRAINT "_UsersPartying_A_fkey";

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "Party";

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT DEFAULT 'Drinks with friends',
    "partyCoords" JSONB,
    "partyAddress" TEXT NOT NULL,
    "partyPictures" TEXT[],
    "partyTags" TEXT[],
    "partyType" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "Country" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMembers" (
    "id" SERIAL NOT NULL,
    "partyId" INTEGER NOT NULL,
    "isFull" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventMembers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventMembers" ADD CONSTRAINT "EventMembers_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersPartying" ADD CONSTRAINT "_UsersPartying_A_fkey" FOREIGN KEY ("A") REFERENCES "EventMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

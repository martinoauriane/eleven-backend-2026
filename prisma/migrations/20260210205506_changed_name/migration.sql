/*
  Warnings:

  - You are about to drop the `EventMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UsersPartying` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventMembers" DROP CONSTRAINT "EventMembers_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_UsersPartying" DROP CONSTRAINT "_UsersPartying_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsersPartying" DROP CONSTRAINT "_UsersPartying_B_fkey";

-- DropTable
DROP TABLE "EventMembers";

-- DropTable
DROP TABLE "_UsersPartying";

-- CreateTable
CREATE TABLE "EventPeople" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "isFull" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventPeople_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PeoplePartying" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PeoplePartying_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PeoplePartying_B_index" ON "_PeoplePartying"("B");

-- AddForeignKey
ALTER TABLE "EventPeople" ADD CONSTRAINT "EventPeople_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeoplePartying" ADD CONSTRAINT "_PeoplePartying_A_fkey" FOREIGN KEY ("A") REFERENCES "EventPeople"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeoplePartying" ADD CONSTRAINT "_PeoplePartying_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

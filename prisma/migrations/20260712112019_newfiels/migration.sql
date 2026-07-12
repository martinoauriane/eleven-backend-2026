/*
  Warnings:

  - You are about to drop the column `emitterId` on the `JoinRequest` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `JoinRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[friendId,eventId]` on the table `JoinRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventHostId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_emitterId_fkey";

-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_receiverId_fkey";

-- DropIndex
DROP INDEX "JoinRequest_emitterId_eventId_key";

-- AlterTable
ALTER TABLE "JoinRequest" DROP COLUMN "emitterId",
DROP COLUMN "receiverId",
ADD COLUMN     "eventHostId" INTEGER NOT NULL,
ADD COLUMN     "friendId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_friendId_eventId_key" ON "JoinRequest"("friendId", "eventId");

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_eventHostId_fkey" FOREIGN KEY ("eventHostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

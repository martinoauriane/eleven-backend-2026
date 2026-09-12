/*
  Warnings:

  - You are about to drop the column `eventHostId` on the `JoinRequest` table. All the data in the column will be lost.
  - You are about to drop the column `friendId` on the `JoinRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,eventId]` on the table `JoinRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_eventHostId_fkey";

-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_friendId_fkey";

-- DropIndex
DROP INDEX "JoinRequest_friendId_eventId_key";

-- AlterTable
ALTER TABLE "JoinRequest" DROP COLUMN "eventHostId",
DROP COLUMN "friendId",
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_senderId_eventId_key" ON "JoinRequest"("senderId", "eventId");

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

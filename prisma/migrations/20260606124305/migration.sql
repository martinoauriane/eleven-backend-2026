/*
  Warnings:

  - You are about to drop the column `isAccepted` on the `JoinRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emitterId,eventId]` on the table `JoinRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `JoinRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('NONE', 'SENT', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "JoinRequest" DROP COLUMN "isAccepted",
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "status" "JoinRequestStatus" NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_emitterId_eventId_key" ON "JoinRequest"("emitterId", "eventId");

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

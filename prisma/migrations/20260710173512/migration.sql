/*
  Warnings:

  - A unique constraint covering the columns `[meetRequestId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MeetRequestStatus" AS ENUM ('SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "meetRequestId" INTEGER;

-- CreateTable
CREATE TABLE "MeetRequest" (
    "id" SERIAL NOT NULL,
    "emitterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "activity" TEXT,
    "status" "MeetRequestStatus" NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "MeetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetRequest_emitterId_receiverId_key" ON "MeetRequest"("emitterId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_meetRequestId_key" ON "Message"("meetRequestId");

-- AddForeignKey
ALTER TABLE "MeetRequest" ADD CONSTRAINT "MeetRequest_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetRequest" ADD CONSTRAINT "MeetRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_meetRequestId_fkey" FOREIGN KEY ("meetRequestId") REFERENCES "MeetRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

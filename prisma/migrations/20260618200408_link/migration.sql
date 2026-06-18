/*
  Warnings:

  - A unique constraint covering the columns `[joinRequestId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "joinRequestId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Message_joinRequestId_key" ON "Message"("joinRequestId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_joinRequestId_fkey" FOREIGN KEY ("joinRequestId") REFERENCES "JoinRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

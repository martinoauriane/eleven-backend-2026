/*
  Warnings:

  - A unique constraint covering the columns `[emitterId,receiverId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_emitterId_receiverId_key" ON "FriendRequest"("emitterId", "receiverId");

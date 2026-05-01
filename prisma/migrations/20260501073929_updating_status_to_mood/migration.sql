/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `statusUpdatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
DROP COLUMN "statusUpdatedAt",
ADD COLUMN     "mood" "MoodStatus",
ADD COLUMN     "moodUpdatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Friendship_friendId_userId_idx" ON "Friendship"("friendId", "userId");

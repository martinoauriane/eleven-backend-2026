/*
  Warnings:

  - You are about to drop the column `City` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `Event` table. All the data in the column will be lost.
  - Added the required column `city` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "City",
DROP COLUMN "Country",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

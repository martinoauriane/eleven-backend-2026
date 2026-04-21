/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MoodStatus" AS ENUM ('CHILLING', 'WANTS_TO_GO_OUT', 'BORED', 'ABOUT_TO_LEAVE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "MoodStatus";

/*
  Warnings:

  - You are about to drop the column `eventType` on the `Event` table. All the data in the column will be lost.
  - Added the required column `activityType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `OnMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activity` to the `OnMap` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('CULTURE', 'PARTY', 'DRINKS', 'FOOD', 'SPORT', 'OUTDOOR');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CONCERT', 'CINEMA', 'MUSEUM', 'EXHIBITION', 'THEATRE', 'CLUBBING', 'HOUSE_PARTY', 'FESTIVAL', 'NIGHT_OUT', 'DRINKS_WITH_FRIENDS', 'APERITIF', 'BAR', 'COFFEE', 'RESTAURANT', 'DINNER', 'LUNCH', 'BRUNCH', 'FOOTBALL', 'RUNNING', 'TENNIS', 'GYM', 'CYCLING', 'WALK', 'HIKING', 'BEACH', 'PARK', 'PICNIC');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventType",
ADD COLUMN     "activityType" "ActivityType" NOT NULL,
ADD COLUMN     "category" "ActivityCategory" NOT NULL;

-- AlterTable
ALTER TABLE "OnMap" ADD COLUMN     "category" "ActivityCategory" NOT NULL,
DROP COLUMN "activity",
ADD COLUMN     "activity" "ActivityType" NOT NULL;

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_activityType_idx" ON "Event"("activityType");

/*
  Warnings:

  - A unique constraint covering the columns `[picture]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserSituation" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "picture" TEXT,

    CONSTRAINT "UserSituation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSituation_picture_key" ON "UserSituation"("picture");

-- CreateIndex
CREATE UNIQUE INDEX "User_picture_key" ON "User"("picture");

-- AddForeignKey
ALTER TABLE "UserSituation" ADD CONSTRAINT "UserSituation_picture_fkey" FOREIGN KEY ("picture") REFERENCES "User"("picture") ON DELETE SET NULL ON UPDATE CASCADE;

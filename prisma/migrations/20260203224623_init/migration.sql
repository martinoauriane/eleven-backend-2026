-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,
    "passwordHash" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "partyAddress" TEXT NOT NULL,
    "partyCoords" JSONB,
    "friendsNumber" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,
    "partyCoords" JSONB,
    "partyAddress" TEXT NOT NULL,
    "partyPictures" TEXT[],
    "partyTags" TEXT[],
    "partyType" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "Country" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "partyId" INTEGER NOT NULL,
    "isFull" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" SERIAL NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "emitterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UsersPartying" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UsersPartying_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_UsersPartying_B_index" ON "_UsersPartying"("B");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_emitterId_fkey" FOREIGN KEY ("emitterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersPartying" ADD CONSTRAINT "_UsersPartying_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersPartying" ADD CONSTRAINT "_UsersPartying_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

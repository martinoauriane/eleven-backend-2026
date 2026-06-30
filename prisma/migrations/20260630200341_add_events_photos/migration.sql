-- CreateTable
CREATE TABLE "EventPhoto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" INTEGER NOT NULL,
    "uploadedById" INTEGER,

    CONSTRAINT "EventPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPhoto" ADD CONSTRAINT "EventPhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

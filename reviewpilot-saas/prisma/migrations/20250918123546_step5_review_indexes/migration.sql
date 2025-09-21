-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "public"."ReviewReply" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "draft" TEXT,
ADD COLUMN     "posted" TEXT,
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'draft';

-- CreateIndex
CREATE INDEX "Review_locationId_idx" ON "public"."Review"("locationId");

-- CreateIndex
CREATE INDEX "Review_externalId_idx" ON "public"."Review"("externalId");

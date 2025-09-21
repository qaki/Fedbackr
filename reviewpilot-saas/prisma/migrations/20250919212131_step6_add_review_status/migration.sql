-- AlterTable
ALTER TABLE "public"."Review" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'new';

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "public"."Review"("status");

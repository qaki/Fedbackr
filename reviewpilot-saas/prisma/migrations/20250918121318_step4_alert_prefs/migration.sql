-- AlterTable
ALTER TABLE "public"."AlertPreference" ADD COLUMN     "channelEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "channelWhatsApp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "frequency" TEXT NOT NULL DEFAULT 'instant',
ADD COLUMN     "starThreshold" INTEGER;

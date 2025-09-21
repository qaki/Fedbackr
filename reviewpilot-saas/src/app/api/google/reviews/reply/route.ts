import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { postGbpReply } from "@/lib/google-gbp";
import { requireOwnerOrMember } from "@/lib/auth-roles";
import { AuditHelpers } from "@/lib/audit";

function buildReviewName(locationExternalId: string, reviewExternalId: string | null) {
  // Prefer full name if already stored; else compose it
  if (!locationExternalId) throw new Error("Missing location externalId");
  if (!reviewExternalId) throw new Error("Missing review externalId");
  return reviewExternalId.startsWith("locations/")
    ? reviewExternalId
    : `${locationExternalId}/reviews/${reviewExternalId}`;
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, replyText } = await req.json();
  if (!reviewId || !replyText) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { location: true },
  });
  if (!review || !review.location) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  // Check user has permission to reply (owner or member, not viewer)
  const membership = await requireOwnerOrMember(session.user.id as string, review.location.organizationId);

  // compute reviewName used by GBP
  const locExt = review.location.externalId!;
  const revName = buildReviewName(locExt, review.externalId);

  try {
    await postGbpReply(membership.organizationId, revName, replyText);

    // Persist as posted
    const reply = await prisma.reviewReply.create({
      data: {
        reviewId: review.id,
        authorId: session.user.id as string,
        draft: null,
        posted: replyText,
        postedAt: new Date(),
        state: "posted",
        content: replyText,
        isAIGenerated: false,
      },
    });
    await prisma.review.update({
      where: { id: review.id },
      data: { status: "replied" },
    });

    // Log audit event
    await AuditHelpers.logReviewReply(membership.organizationId, session.user.id as string, review.id, reply.id);

    return NextResponse.json({ posted: true });
  } catch (e: any) {
    // Store as draft (so user doesn't lose text) and tell client to fallback
    await prisma.reviewReply.create({
      data: {
        reviewId: review.id,
        authorId: session.user.id as string,
        draft: replyText,
        posted: null,
        state: "draft",
        content: replyText,
        isAIGenerated: true,
      },
    });

    // Provide a generic link to Google Business Reviews manager as a safe fallback
    const fallbackUrl = "https://business.google.com/reviews";

    return NextResponse.json({
      posted: false,
      error: e?.message || "Failed to post via API",
      code: e?.code || "API_FAIL",
      fallbackUrl,
      replyText,
    }, { status: 200 });
  }
}

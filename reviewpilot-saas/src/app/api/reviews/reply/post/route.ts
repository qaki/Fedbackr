import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { postGbpReply } from "@/lib/google-gbp";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, replyText } = await req.json();
  if (!reviewId || !replyText) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { location: true } });
  if (!review || !review.location) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const membership = await prisma.membership.findFirst({ where: { userId: session.user.id as string } });
  if (!membership) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const locExt = review.location.externalId!;
  const reviewName = review.externalId?.startsWith("locations/") ? review.externalId as string : `${locExt}/reviews/${review.externalId}`;

  try {
    await postGbpReply(membership.organizationId, reviewName, replyText);

    await prisma.reviewReply.create({
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

    return NextResponse.json({ ok: true, posted: true });
  } catch (e:any) {
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
    return NextResponse.json({ ok: false, posted: false, message: "Could not post automatically. Please paste this reply in Google Business.", replyText });
  }
}



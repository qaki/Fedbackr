import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reviewId, text } = await req.json();
  if (!reviewId || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { location: true } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id as string, organizationId: review.location.organizationId },
  });
  if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.reviewReply.create({
    data: {
      reviewId,
      authorId: session.user.id as string,
      draft: null,
      posted: text,
      postedAt: new Date(),
      state: "posted",
      content: text,
      isAIGenerated: false,
    },
  });
  await prisma.review.update({ where: { id: reviewId }, data: { status: "replied" } });

  return NextResponse.json({ ok: true });
}

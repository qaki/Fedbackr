import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ items: [] }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all"; // all | new | unreplied | negative
  const take = Math.min(Number(searchParams.get("take") || 50), 200);
  const skip = Math.max(Number(searchParams.get("skip") || 0), 0);

  const m = await prisma.membership.findFirst({ where: { userId: session.user.id as string } });
  if (!m) return NextResponse.json({ items: [] }, { status: 400 });

  const loc = await prisma.location.findFirst({ 
    where: { 
      organizationId: m.organizationId,
      deleted: false // Exclude soft-deleted locations
    } 
  });
  if (!loc) return NextResponse.json({ items: [] });

  let where:any = { locationId: loc.id };
  if (filter === "new") {
    where.createdAt = { gte: new Date(Date.now() - 7*24*60*60*1000) };
  } else if (filter === "unreplied") {
    where.replies = { none: { state: "posted" } };
  } else if (filter === "negative") {
    where.rating = { lte: 3 };
  }

  const items = await prisma.review.findMany({
    where,
    orderBy: { postedAt: "desc" },
    skip, take,
    include: { replies: true },
  });

  // Derive status from replies and update Review.status if needed
  for (const item of items) {
    const hasPostedReply = item.replies.some((r: any) => r.state === "posted");
    const hasDraftReply = item.replies.some((r: any) => r.state === "draft");
    
    let derivedStatus = "new";
    if (hasPostedReply) derivedStatus = "replied";
    else if (hasDraftReply) derivedStatus = "drafted";
    
    // Update Review.status if it doesn't match the derived status
    if (item.status !== derivedStatus) {
      await prisma.review.update({
        where: { id: item.id },
        data: { status: derivedStatus },
      });
      item.status = derivedStatus;
    }
  }

  return NextResponse.json({ items });
}



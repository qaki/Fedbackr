import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { syncOrgLocationReviews } from "@/lib/reviews-sync";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const m = await prisma.membership.findFirst({ where: { userId: session.user.id as string } });
  if (!m) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const org = await prisma.organization.findUnique({ where: { id: m.organizationId }, include: { locations: { take:1, orderBy:{createdAt:"asc"} } } });
  const loc = org?.locations?.[0];
  if (!loc?.externalId) return NextResponse.json({ error: "No location selected" }, { status: 400 });

  try {
    const res = await syncOrgLocationReviews(org!.id, loc.id, loc.externalId);
    return NextResponse.json({ ok: true, ...res });
  } catch (e:any) {
    console.error("Manual sync error", e);
    return NextResponse.json({ error: e.message || "Sync failed" }, { status: 500 });
  }
}



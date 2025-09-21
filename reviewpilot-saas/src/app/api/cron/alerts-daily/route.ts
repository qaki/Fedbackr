import { NextResponse } from "next/server";
import { sendDailyDigestForOrg } from "@/lib/alerts";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all organizations that have locations
    const orgs = await prisma.organization.findMany({
      where: { hasSelectedLocation: true },
      include: { locations: true },
    });

    let totalSent = 0;
    for (const org of orgs) {
      const result = await sendDailyDigestForOrg(org.id);
      totalSent += result.sent;
    }

    return NextResponse.json({ 
      ok: true, 
      organizationsProcessed: orgs.length,
      totalSent 
    });
  } catch (error) {
    console.error("Daily digest cron error:", error);
    return NextResponse.json({ 
      error: "Daily digest failed" 
    }, { status: 500 });
  }
}

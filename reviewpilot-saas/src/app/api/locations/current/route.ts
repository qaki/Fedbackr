import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    // Get the first location for this organization (MVP approach)
    const location = await prisma.location.findFirst({
      where: { organizationId: membership.organizationId },
      orderBy: { createdAt: "asc" },
    });

    if (!location) {
      return NextResponse.json({ error: "No location found" }, { status: 404 });
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error("Error getting current location:", error);
    return NextResponse.json({ error: "Failed to get location" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserOrgId } from "@/lib/subscription";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { externalId, name } = body as { externalId: string; name: string };

    if (!externalId || !name) {
      return NextResponse.json({ error: "Missing externalId or name" }, { status: 400 });
    }

    const orgId = await getUserOrgId(user.id);
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    // upsert location by externalId within org
    let location = await prisma.location.findFirst({
      where: { organizationId: orgId, externalId },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          organizationId: orgId,
          externalId,
          name,
        },
      });
    } else {
      // ensure latest name
      await prisma.location.update({
        where: { id: location.id },
        data: { name },
      });
    }

    // mark onboarding flag
    await prisma.organization.update({
      where: { id: orgId },
      data: { hasSelectedLocation: true },
    });

    // Optionally set it as "primary" later; for now we just create one
    return NextResponse.json({ ok: true, locationId: location.id });

  } catch (error) {
    console.error("Location attach error:", error);
    return NextResponse.json({ error: "Failed to attach location" }, { status: 500 });
  }
}

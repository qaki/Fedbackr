import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { requireOwnerOrMember } from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId required" }, { status: 400 });
    }

    // Check user has access to this organization
    await requireOwnerOrMember(user.id, organizationId);

    // Build where clause
    const where: any = { organizationId };
    if (action) {
      where.action = action;
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      auditLogs,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}

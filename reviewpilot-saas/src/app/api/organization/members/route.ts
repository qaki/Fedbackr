import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/auth-roles";
import { AuditHelpers } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId required" }, { status: 400 });
    }

    // Check user is owner
    await requireOwner(user.id, organizationId);

    const members = await prisma.membership.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { role: "asc" }, // owner first
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json({ members });
  } catch (error: any) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organizationId, email, role = "member" } = await request.json();

    if (!organizationId || !email) {
      return NextResponse.json({ error: "organizationId and email required" }, { status: 400 });
    }

    // Check user is owner
    await requireOwner(user.id, organizationId);

    // Find user by email
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: targetUser.id,
          organizationId,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member" }, { status: 400 });
    }

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        userId: targetUser.id,
        organizationId,
        role: role as any,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log audit event
    await AuditHelpers.logUserRoleChange(organizationId, user.id, targetUser.id, "none", role);

    return NextResponse.json({ membership });
  } catch (error: any) {
    console.error("Error adding member:", error);
    return NextResponse.json({ error: error.message || "Failed to add member" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { membershipId, role } = await request.json();

    if (!membershipId || !role) {
      return NextResponse.json({ error: "membershipId and role required" }, { status: 400 });
    }

    // Get current membership
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { user: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // Check user is owner
    await requireOwner(user.id, membership.organizationId);

    // Prevent changing own role
    if (membership.userId === user.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const oldRole = membership.role;

    // Update role
    const updatedMembership = await prisma.membership.update({
      where: { id: membershipId },
      data: { role: role as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log audit event
    await AuditHelpers.logUserRoleChange(membership.organizationId, user.id, membership.userId, oldRole, role);

    return NextResponse.json({ membership: updatedMembership });
  } catch (error: any) {
    console.error("Error updating member role:", error);
    return NextResponse.json({ error: error.message || "Failed to update member role" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json({ error: "membershipId required" }, { status: 400 });
    }

    // Get current membership
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { user: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // Check user is owner
    await requireOwner(user.id, membership.organizationId);

    // Prevent removing self
    if (membership.userId === user.id) {
      return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    // Remove membership
    await prisma.membership.delete({
      where: { id: membershipId },
    });

    // Log audit event
    await AuditHelpers.logUserRoleChange(membership.organizationId, user.id, membership.userId, membership.role, "removed");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: error.message || "Failed to remove member" }, { status: 500 });
  }
}

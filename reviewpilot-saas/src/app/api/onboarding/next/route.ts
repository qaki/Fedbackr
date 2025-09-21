import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserOrgId } from "@/lib/subscription";
import { getOnboardingNextPath } from "@/lib/onboarding";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = await getUserOrgId(user.id);
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const nextPath = await getOnboardingNextPath(orgId);
    return NextResponse.json({ next: nextPath });

  } catch (error) {
    console.error("Onboarding next path error:", error);
    return NextResponse.json({ error: "Failed to get next path" }, { status: 500 });
  }
}

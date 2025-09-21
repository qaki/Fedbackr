import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserOrgId } from "@/lib/subscription";
import { buildGoogleAuthUrl } from "@/lib/google-oauth";
import crypto from "crypto";

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

    // Create a short-lived state to mitigate CSRF
    const state = crypto.randomBytes(24).toString("hex") + ":" + orgId;

    const url = buildGoogleAuthUrl(state);
    return NextResponse.json({ url });

  } catch (error) {
    console.error("Google OAuth start error:", error);
    return NextResponse.json({ error: "Failed to start OAuth" }, { status: 500 });
  }
}

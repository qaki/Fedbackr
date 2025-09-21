import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getUserOrgId } from "@/lib/subscription";
import { getOrgGoogleTokens, listLocations } from "@/lib/google-gbp";

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

    // Ensure Google connected
    const tokens = await getOrgGoogleTokens(orgId);
    if (!tokens) {
      // user must connect Google first
      return NextResponse.json({ needsConnect: true }, { status: 200 });
    }

    // Option A: if you already saved the accountName, use it here.
    // Option B: list accounts, pick the first one where the user is manager/owner.
    // For simplicity we attempt a default account "accounts/". You can enhance with actual accounts list.
    // Example minimal approach:
    const accountsRes = await fetch(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
    );
    if (!accountsRes.ok) {
      return NextResponse.json({ error: "Failed to list accounts" }, { status: 500 });
    }
    const accounts = await accountsRes.json();
    const account = accounts?.accounts?.[0];
    if (!account?.name) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const locsJson = await listLocations(tokens.accessToken, account.name); // accounts/123...
    const items = (locsJson?.locations || []).map((loc: any) => ({
      id: loc.name, // "locations/1234567890"
      displayName: loc.title || loc.locationName || "Unnamed location",
      address:
        loc?.storefrontAddress?.addressLines?.join(", ") ||
        loc?.address?.addressLines?.join(", ") ||
        "",
    }));

    return NextResponse.json({ items });

  } catch (error) {
    console.error("Google locations error:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

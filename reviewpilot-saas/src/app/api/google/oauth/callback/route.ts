import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens } from "@/lib/google-oauth";
import { TokenEncryption } from "@/lib/crypto";
import { AuditHelpers } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";
  const error = url.searchParams.get("error");

  if (error) {
    // user canceled or scope denied
    return NextResponse.redirect(`${process.env.APP_URL}/onboarding/connect?error=${encodeURIComponent(error)}`);
  }
  if (!code || !state.includes(":")) {
    return NextResponse.redirect(`${process.env.APP_URL}/onboarding/connect?error=invalid_state`);
  }

  const [, organizationId] = state.split(":");

  try {
    const tokenRes = await exchangeCodeForTokens(code);
    const expiresAt = new Date(Date.now() + (tokenRes.expires_in || 0) * 1000);

    // Save/Upsert tokens to IntegrationGoogle (encrypted)
    await prisma.integrationGoogle.upsert({
      where: { organizationId },
      create: {
        organizationId,
        accessTokenEnc: TokenEncryption.encrypt(tokenRes.access_token),
        refreshTokenEnc: TokenEncryption.encrypt(tokenRes.refresh_token ?? ""),
        tokenType: tokenRes.token_type ?? null,
        scope: tokenRes.scope ?? null,
        expiryDate: expiresAt,
      },
      update: {
        accessTokenEnc: TokenEncryption.encrypt(tokenRes.access_token),
        // Google may omit refresh_token if user previously consented; keep old one if missing:
        refreshTokenEnc: tokenRes.refresh_token ? TokenEncryption.encrypt(tokenRes.refresh_token) : undefined,
        tokenType: tokenRes.token_type ?? undefined,
        scope: tokenRes.scope ?? undefined,
        expiryDate: expiresAt,
      },
    });

    // Mark onboarding flag
    await prisma.organization.update({
      where: { id: organizationId },
      data: { hasConnectedGoogle: true },
    });

    // Log audit event (we don't have userId here, so we'll log without it)
    await AuditHelpers.logGoogleConnection(organizationId, "");

    // Continue to next step (select location)
    return NextResponse.redirect(`${process.env.APP_URL}/onboarding/location`);
  } catch (e) {
    console.error("Google OAuth callback error:", e);
    return NextResponse.redirect(`${process.env.APP_URL}/onboarding/connect?error=token_exchange_failed`);
  }
}

export type GbpLocation = {
  name: string;         // e.g. "locations/1234567890"
  title?: string;       // display name
  address?: string;
};

type TokenBundle = { accessToken: string; refreshToken?: string; expiryDate?: Date };

export async function getOrgGoogleTokens(orgId: string): Promise<TokenBundle | null> {
  // read IntegrationGoogle by organizationId and return tokens
  // (refresh flow can be added later; for now assume valid accessToken)
  const { prisma } = await import("@/lib/prisma");
  const integ = await prisma.integrationGoogle.findUnique({ where: { organizationId: orgId } });
  if (!integ?.accessTokenEnc) return null;
  
  // Decrypt tokens
  const { TokenEncryption } = await import("@/lib/crypto");
  const accessToken = TokenEncryption.decrypt(integ.accessTokenEnc);
  const refreshToken = TokenEncryption.decrypt(integ.refreshTokenEnc);
  
  if (!accessToken) return null;
  
  return {
    accessToken,
    refreshToken: refreshToken ?? undefined,
    expiryDate: integ.expiryDate ?? undefined,
  };
}

// List accounts for the authenticated user (optional; sometimes you need accountId first)
async function listAccounts(accessToken: string) {
  const res = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to list accounts");
  return res.json();
}

// List locations for an account
export async function listLocations(accessToken: string, accountName: string) {
  // accountName example: "accounts/123456789"
  const url = new URL(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`
  );
  // add fields or filters if necessary
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to list locations");
  return res.json();
}

import { getValidAccessToken } from "@/lib/google-token";

export async function listGbpReviews(organizationId: string, locationExternalId: string) {
  const token = await getValidAccessToken(organizationId);
  if (!token) throw new Error("No Google access token");
  const url = `https://mybusiness.googleapis.com/v4/${locationExternalId}/reviews`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Reviews list failed: ${await res.text()}`);
  return res.json();
}

export async function postGbpReply(organizationId: string, reviewName: string, replyText: string) {
  const token = await getValidAccessToken(organizationId);
  if (!token) throw Object.assign(new Error("Missing Google access token"), { code: "NO_TOKEN" });

  // GBP v4: PUT { comment } to /v4/{reviewName}/reply
  const url = `https://mybusiness.googleapis.com/v4/${reviewName.replace(/^v4\//, "")}/reply`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ comment: replyText }),
  });

  if (!res.ok) {
    const text = await res.text();
    // normalize the error with a code if possible
    const err = Object.assign(new Error(text || "GBP reply failed"), { code: String(res.status) });
    throw err;
  }
  return res.json(); // usually empty or { ... }
}

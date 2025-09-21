export const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/**
 * Scopes for Business Profile (locations + replies). Keep minimal to reduce review friction.
 * - https://www.googleapis.com/auth/business.manage
 * - openid email profile (optional convenience)
 */
export const GBP_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/business.manage",
].join(" ");

export function buildGoogleAuthUrl(state: string) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const redirectUri = `${process.env.APP_URL}/api/google/oauth/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GBP_SCOPES,
    access_type: "offline",     // get refresh_token
    prompt: "consent",          // force refresh_token on repeat connects
    include_granted_scopes: "true",
    state,
  });
  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const redirectUri = `${process.env.APP_URL}/api/google/oauth/callback`;

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
    token_type?: string;
    id_token?: string;
  }>;
}

export async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Refresh failed: ${await res.text()}`);
  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
    scope?: string;
    token_type?: string;
  }>;
}

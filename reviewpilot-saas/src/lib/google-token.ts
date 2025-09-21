import { prisma } from "@/lib/prisma";
import { refreshAccessToken } from "@/lib/google-oauth";
import { TokenEncryption } from "@/lib/crypto";

export async function getValidAccessToken(organizationId: string) {
  const integ = await prisma.integrationGoogle.findUnique({ where: { organizationId } });
  if (!integ?.accessTokenEnc) return null;

  // Decrypt the access token
  const accessToken = TokenEncryption.decrypt(integ.accessTokenEnc);
  if (!accessToken) return null;

  // If expires within 2 minutes, refresh
  const soon = new Date(Date.now() + 2 * 60 * 1000);
  if (integ.expiryDate && integ.expiryDate < soon && integ.refreshTokenEnc) {
    try {
      const refreshToken = TokenEncryption.decrypt(integ.refreshTokenEnc);
      if (!refreshToken) return accessToken;

      const res = await refreshAccessToken(refreshToken);
      const newExpiry = new Date(Date.now() + (res.expires_in || 0) * 1000);
      
      await prisma.integrationGoogle.update({
        where: { organizationId },
        data: {
          accessTokenEnc: TokenEncryption.encrypt(res.access_token),
          tokenType: res.token_type ?? integ.tokenType,
          scope: res.scope ?? integ.scope,
          expiryDate: newExpiry,
        },
      });
      return res.access_token;
    } catch (e) {
      console.error("Refresh failed", e);
      return accessToken; // try with old token; upstream may 401
    }
  }
  return accessToken;
}

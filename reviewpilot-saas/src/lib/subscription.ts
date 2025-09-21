import { prisma } from "@/lib/prisma";

export async function getUserOrgId(userId: string) {
  const m = await prisma.membership.findFirst({ where: { userId } });
  return m?.organizationId ?? null;
}

export async function userHasAccess(userId: string) {
  const orgId = await getUserOrgId(userId);
  if (!orgId) return false;
  const s = await prisma.subscription.findUnique({ where: { organizationId: orgId } });
  return ["trialing", "active", "on_trial", "active"].includes(s?.status ?? "");
}

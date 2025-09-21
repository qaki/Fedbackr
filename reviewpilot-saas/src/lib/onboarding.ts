import { prisma } from "@/lib/prisma";

export async function getOnboardingNextPath(organizationId: string): Promise<string> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      hasConnectedGoogle: true,
      hasSelectedLocation: true,
      hasSetAlerts: true,
    },
  });

  if (!org) return "/app";

  // Check onboarding steps in order
  if (!org.hasConnectedGoogle) {
    return "/onboarding/connect";
  }
  
  if (!org.hasSelectedLocation) {
    return "/onboarding/location";
  }
  
  if (!org.hasSetAlerts) {
    return "/onboarding/alerts";
  }

  // All steps completed
  return "/app";
}

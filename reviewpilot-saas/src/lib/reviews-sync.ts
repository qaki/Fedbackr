import { prisma } from "@/lib/prisma";
import { listGbpReviews } from "@/lib/google-gbp";
import { triggerInstantAlertsForReview } from "@/lib/alerts";

function toInt(star: any): number | null {
  if (typeof star === "number") return star;
  if (typeof star === "string") {
    const m = star.match(/\d/);
    return m ? Number(m[0]) : null;
  }
  return null;
}

export async function syncOrgLocationReviews(organizationId: string, locationId: string, locationExternalId: string) {
  const json = await listGbpReviews(organizationId, locationExternalId);
  const items = json?.reviews || [];

  let newCount = 0;

  for (const r of items) {
    const extId: string | null = r.reviewId || r.name || null;
    const rating = toInt(r.starRating);
    const author = r.reviewer?.displayName || r.reviewer || "Customer";
    const text = r.comment || r.text || "";
    const created = r.createTime ? new Date(r.createTime) : new Date();

    if (extId) {
      const existing = await prisma.review.findFirst({ where: { locationId, externalId: extId } });
      if (existing) continue;
    }

    const createdReview = await prisma.review.create({
      data: {
        locationId,
        externalId: extId || undefined,
        authorName: author,
        rating: rating ?? 0,
        content: text,
        text,
        publishedAt: created,
        postedAt: created,
        platform: 'google',
        platformId: extId || '',
      },
    });

    newCount++;

    // Trigger alerts for this specific review
    try {
      await triggerInstantAlertsForReview(createdReview.id)
    } catch (e) {
      console.error('Alert trigger failed', e)
    }
  }

  return { newCount, totalFetched: items.length };
}

export async function syncAllOrgsOnce() {
  const orgs = await prisma.organization.findMany({
    where: { hasSelectedLocation: true },
    include: { locations: { take: 1, orderBy: { createdAt: 'asc' } } },
  });
  let totalNew = 0;
  for (const org of orgs) {
    const loc = org.locations[0];
    if (!loc?.externalId) continue;
    const res = await syncOrgLocationReviews(org.id, loc.id, loc.externalId);
    totalNew += res.newCount;
  }
  return { totalNew };
}



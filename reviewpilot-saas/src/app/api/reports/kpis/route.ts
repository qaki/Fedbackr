import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const locationId = searchParams.get("locationId");

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      select: { organizationId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // Build where clause for location filtering
    let whereClause: any = {
      location: {
        organizationId: membership.organizationId,
      },
      createdAt: {
        gte: sinceDate,
      },
    };

    if (locationId) {
      whereClause.locationId = locationId;
    }

    // Get all reviews for the period
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        replies: {
          where: { state: "posted" },
          orderBy: { postedAt: "asc" },
        },
        location: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate KPIs
    const totalReviews = reviews.length;
    const newReviews = reviews.filter(r => r.createdAt >= sinceDate).length;
    
    // Average rating
    const ratings = reviews.map(r => r.rating).filter(r => r !== null && r !== undefined);
    const avgRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
    
    // Response rate (% replied)
    const repliedReviews = reviews.filter(r => r.replies.length > 0);
    const responseRate = totalReviews > 0 ? (repliedReviews.length / totalReviews) * 100 : 0;
    
    // Median response time (in hours)
    const responseTimes: number[] = [];
    repliedReviews.forEach(review => {
      const firstReply = review.replies[0];
      if (firstReply?.postedAt) {
        const responseTimeMs = firstReply.postedAt.getTime() - review.createdAt.getTime();
        const responseTimeHours = responseTimeMs / (1000 * 60 * 60);
        responseTimes.push(responseTimeHours);
      }
    });
    
    const medianResponseTime = responseTimes.length > 0 
      ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length / 2)]
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    // Recent reviews (last 7 days)
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentReviews = reviews.filter(r => r.createdAt >= recentDate);

    return NextResponse.json({
      period: days,
      totalReviews,
      newReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      responseRate: Math.round(responseRate * 10) / 10,
      medianResponseTime: Math.round(medianResponseTime * 10) / 10,
      ratingDistribution,
      recentReviews: recentReviews.length,
      repliedReviews: repliedReviews.length,
      unrepliedReviews: totalReviews - repliedReviews.length,
    });
  } catch (error) {
    console.error("Error calculating KPIs:", error);
    return NextResponse.json({ error: "Failed to calculate KPIs" }, { status: 500 });
  }
}

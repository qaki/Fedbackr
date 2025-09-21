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
    const format = searchParams.get("format") || "csv";
    const type = searchParams.get("type") || "reviews"; // reviews, replies, or both
    const days = parseInt(searchParams.get("days") || "90");
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

    if (format === "csv") {
      if (type === "reviews" || type === "both") {
        // Export reviews
        const reviews = await prisma.review.findMany({
          where: whereClause,
          include: {
            location: true,
            replies: {
              where: { state: "posted" },
              orderBy: { postedAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        const csvHeaders = [
          "Review ID",
          "Location",
          "Platform",
          "Author Name",
          "Rating",
          "Review Text",
          "Review Date",
          "Response Status",
          "Response Text",
          "Response Date",
          "Response Time (Hours)",
        ];

        const csvRows = reviews.map(review => {
          const firstReply = review.replies[0];
          const responseTime = firstReply?.postedAt 
            ? ((firstReply.postedAt.getTime() - review.createdAt.getTime()) / (1000 * 60 * 60)).toFixed(2)
            : "";

          return [
            review.id,
            `"${review.location.name}"`,
            review.platform,
            `"${review.authorName || 'Anonymous'}"`,
            review.rating,
            `"${(review.content || '').replace(/"/g, '""')}"`,
            review.createdAt.toISOString().split('T')[0],
            review.replies.length > 0 ? "Replied" : "No Reply",
            firstReply ? `"${(firstReply.posted || '').replace(/"/g, '""')}"` : "",
            firstReply?.postedAt ? firstReply.postedAt.toISOString().split('T')[0] : "",
            responseTime,
          ];
        });

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.join(","))
          .join("\n");

        const filename = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`;

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      }

      if (type === "replies") {
        // Export replies only
        const replies = await prisma.reviewReply.findMany({
          where: {
            state: "posted",
            review: {
              ...whereClause,
            },
          },
          include: {
            review: {
              include: {
                location: true,
              },
            },
          },
          orderBy: { postedAt: "desc" },
        });

        const csvHeaders = [
          "Reply ID",
          "Review ID",
          "Location",
          "Platform",
          "Review Author",
          "Review Rating",
          "Review Text",
          "Review Date",
          "Reply Text",
          "Reply Date",
          "Response Time (Hours)",
        ];

        const csvRows = replies.map(reply => {
          const responseTime = reply.postedAt 
            ? ((reply.postedAt.getTime() - reply.review.createdAt.getTime()) / (1000 * 60 * 60)).toFixed(2)
            : "";

          return [
            reply.id,
            reply.reviewId,
            `"${reply.review.location.name}"`,
            reply.review.platform,
            `"${reply.review.authorName || 'Anonymous'}"`,
            reply.review.rating,
            `"${(reply.review.content || '').replace(/"/g, '""')}"`,
            reply.review.createdAt.toISOString().split('T')[0],
            `"${(reply.posted || '').replace(/"/g, '""')}"`,
            reply.postedAt ? reply.postedAt.toISOString().split('T')[0] : "",
            responseTime,
          ];
        });

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.join(","))
          .join("\n");

        const filename = `replies-export-${new Date().toISOString().split('T')[0]}.csv`;

        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      }
    }

    return NextResponse.json({ error: "Unsupported format or type" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

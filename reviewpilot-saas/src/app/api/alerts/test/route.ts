import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'
import { triggerNewReviewAlerts } from '@/lib/alerts'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");

    if (!locationId) {
      return NextResponse.json({ error: "locationId parameter required" }, { status: 400 });
    }

    const membership = await prisma.membership.findFirst({ where: { userId: user.id } })
    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    // Verify user has access to this location
    const location = await prisma.location.findFirst({
      where: { 
        id: locationId, 
        organizationId: membership.organizationId 
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found or access denied" }, { status: 404 });
    }

    const result = await triggerNewReviewAlerts({
      organizationId: membership.organizationId,
      locationId,
      platform: 'google',
      rating: 2,
      author: 'Test User',
      content: 'This is a simulated alert from ReviewPilot.',
      reviewUrl: 'https://google.com/maps',
      locationName: location.name
    })

    return NextResponse.json({ ok: true, sent: result.sent })
  } catch (error) {
    console.error('POST /api/alerts/test error', error)
    return NextResponse.json({ error: 'Failed to send test alert' }, { status: 500 })
  }
}



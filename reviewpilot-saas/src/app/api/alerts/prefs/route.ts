import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

async function getOrgId(userId: string) {
  const m = await prisma.membership.findFirst({ where: { userId } })
  return m?.organizationId ?? null
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("locationId");

    if (!locationId) {
      return NextResponse.json({ error: "locationId parameter required" }, { status: 400 });
    }

    const orgId = await getOrgId(user.id)
    if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    // Verify user has access to this location
    const location = await prisma.location.findFirst({
      where: { 
        id: locationId, 
        organizationId: orgId 
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found or access denied" }, { status: 404 });
    }

    const pref = await prisma.alertPreference.findUnique({
      where: { userId_locationId: { userId: user.id, locationId } },
    })
    return NextResponse.json({ pref })
  } catch (error) {
    console.error('GET /api/alerts/prefs error', error)
    return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");

    if (!locationId) {
      return NextResponse.json({ error: "locationId parameter required" }, { status: 400 });
    }

    const orgId = await getOrgId(user.id)
    if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 400 })

    // Verify user has access to this location
    const location = await prisma.location.findFirst({
      where: { 
        id: locationId, 
        organizationId: orgId 
      },
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found or access denied" }, { status: 404 });
    }

    const body = await req.json()
    const {
      channelEmail = true,
      channelWhatsApp = false,
      whatsappNumber,
      starThreshold,
      frequency = 'instant',
    } = body || {}

    const pref = await prisma.alertPreference.upsert({
      where: { userId_locationId: { userId: user.id, locationId } },
      update: {
        channelEmail,
        channelWhatsApp,
        whatsappNumber: channelWhatsApp ? whatsappNumber : null,
        starThreshold: starThreshold ? parseInt(starThreshold) : null,
        frequency,
      },
      create: {
        userId: user.id,
        organizationId: orgId,
        locationId,
        channelEmail,
        channelWhatsApp,
        whatsappNumber: channelWhatsApp ? whatsappNumber : null,
        starThreshold: starThreshold ? parseInt(starThreshold) : null,
        frequency,
      },
    })

    // Mark onboarding flag
    await prisma.organization.update({
      where: { id: orgId },
      data: { hasSetAlerts: true },
    })

    return NextResponse.json({ ok: true, pref })
  } catch (error) {
    console.error('POST /api/alerts/prefs error', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}



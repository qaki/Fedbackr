import { NextRequest, NextResponse } from "next/server"
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { getCurrentUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    })

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 })
    }

    const organization = membership.organization

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { organizationId: organization.id },
    })

    if (existingSubscription && existingSubscription.status === 'active') {
      return NextResponse.json({ error: "Subscription already active" }, { status: 400 })
    }

    // Create Lemon Squeezy checkout
    const checkout = await createCheckout(
      process.env.LEMON_SQUEEZY_STORE_ID!,
      process.env.LEMON_SQUEEZY_VARIANT_ID!, // $39.99/mo variant
      {
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        checkoutData: {
          email: user.email || '',
          name: user.name || '',
          custom: {
            organization_id: organization.id,
            user_id: user.id,
          },
        },
        productOptions: {
          name: 'ReviewPilot Pro',
          description: 'AI-powered review management for local businesses',
          media: [],
          redirectUrl: `${process.env.NEXTAUTH_URL}/onboarding/success?checkout=success`,
          receiptButtonText: 'Continue to Dashboard',
          receiptThankYouNote: 'Thank you for subscribing to ReviewPilot Pro!',
        },
        expiresAt: null,
        preview: false,
        testMode: process.env.NODE_ENV === 'development',
      }
    )

    if (!checkout.data) {
      throw new Error('Failed to create checkout')
    }

    // Store checkout session info (optional - for tracking)
    await prisma.webhookEvent.create({
      data: {
        organizationId: organization.id,
        platform: 'lemonsqueezy',
        eventType: 'checkout.created',
        payload: {
          checkoutId: (checkout.data as any).id,
          checkoutUrl: (checkout.data as any).attributes.url,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({
      url: (checkout.data as any).attributes.url,
      checkoutId: (checkout.data as any).id,
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    )
  }
}

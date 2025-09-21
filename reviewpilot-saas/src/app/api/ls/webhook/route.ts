import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')

    // Verify webhook signature
    if (!signature) {
      console.error('No signature provided')
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid signature')
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const data = JSON.parse(body)
    const eventType = data.meta?.event_name

    console.log('Lemon Squeezy webhook received:', eventType, data)

    // Handle different event types
    switch (eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(data)
        break
      case 'subscription_updated':
        await handleSubscriptionUpdated(data)
        break
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data)
        break
      case 'subscription_resumed':
        await handleSubscriptionResumed(data)
        break
      case 'subscription_expired':
        await handleSubscriptionExpired(data)
        break
      default:
        console.log('Unhandled event type:', eventType)
    }

    // Store webhook event
    const customData = data.data?.attributes?.custom_data
    if (customData?.organization_id) {
      await prisma.webhookEvent.create({
        data: {
          organizationId: customData.organization_id,
          platform: 'lemonsqueezy',
          eventType: eventType,
          payload: data,
          processed: true,
          processedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSubscriptionCreated(data: any) {
  const subscription = data.data
  const attributes = subscription.attributes
  const customData = attributes.custom_data

  if (!customData?.organization_id) {
    console.error('No organization_id in custom_data')
    return
  }

  // Create or update subscription record
  await prisma.subscription.upsert({
    where: { organizationId: customData.organization_id },
    update: {
      lsStoreId: attributes.store_id?.toString(),
      lsVariantId: attributes.variant_id?.toString(),
      lsCustomerId: attributes.customer_id?.toString(),
      lsSubscriptionId: subscription.id,
      status: attributes.status,
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
      trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : null,
    },
    create: {
      organizationId: customData.organization_id,
      lsStoreId: attributes.store_id?.toString(),
      lsVariantId: attributes.variant_id?.toString(),
      lsCustomerId: attributes.customer_id?.toString(),
      lsSubscriptionId: subscription.id,
      status: attributes.status,
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
      trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : null,
    },
  })

  console.log('Subscription created/updated for organization:', customData.organization_id)
}

async function handleSubscriptionUpdated(data: any) {
  const subscription = data.data
  const attributes = subscription.attributes
  const customData = attributes.custom_data

  if (!customData?.organization_id) {
    console.error('No organization_id in custom_data')
    return
  }

  await prisma.subscription.update({
    where: { organizationId: customData.organization_id },
    data: {
      status: attributes.status,
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
      trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : null,
    },
  })

  console.log('Subscription updated for organization:', customData.organization_id)
}

async function handleSubscriptionCancelled(data: any) {
  const subscription = data.data
  const attributes = subscription.attributes
  const customData = attributes.custom_data

  if (!customData?.organization_id) {
    console.error('No organization_id in custom_data')
    return
  }

  await prisma.subscription.update({
    where: { organizationId: customData.organization_id },
    data: {
      status: 'canceled',
    },
  })

  console.log('Subscription cancelled for organization:', customData.organization_id)
}

async function handleSubscriptionResumed(data: any) {
  const subscription = data.data
  const attributes = subscription.attributes
  const customData = attributes.custom_data

  if (!customData?.organization_id) {
    console.error('No organization_id in custom_data')
    return
  }

  await prisma.subscription.update({
    where: { organizationId: customData.organization_id },
    data: {
      status: 'active',
      currentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
    },
  })

  console.log('Subscription resumed for organization:', customData.organization_id)
}

async function handleSubscriptionExpired(data: any) {
  const subscription = data.data
  const attributes = subscription.attributes
  const customData = attributes.custom_data

  if (!customData?.organization_id) {
    console.error('No organization_id in custom_data')
    return
  }

  await prisma.subscription.update({
    where: { organizationId: customData.organization_id },
    data: {
      status: 'expired',
    },
  })

  console.log('Subscription expired for organization:', customData.organization_id)
}

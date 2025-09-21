import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'
import { sendWhatsApp } from '@/lib/whatsapp'

export type NewReviewPayload = {
  organizationId: string
  locationId: string
  locationName?: string
  platform: string
  rating: number
  author?: string
  content: string
  reviewUrl?: string
}

export async function triggerInstantAlertsForReview(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { location: true }
  })
  
  if (!review || !review.location) {
    console.error('Review or location not found for alert trigger')
    return { sent: 0 }
  }

  const payload: NewReviewPayload = {
    organizationId: review.location.organizationId,
    locationId: review.locationId,
    locationName: review.location.name,
    platform: review.platform,
    rating: review.rating,
    author: review.authorName || undefined,
    content: review.content,
    reviewUrl: review.reviewUrl || undefined
  }

  return await triggerNewReviewAlerts(payload)
}

export async function triggerNewReviewAlerts(payload: NewReviewPayload) {
  const { organizationId, locationId, platform, rating, author, content, reviewUrl, locationName } = payload

  // Get preferences for this specific location
  const prefs = await prisma.alertPreference.findMany({ 
    where: { 
      organizationId,
      locationId,
      frequency: 'instant' // Only instant alerts for now
    },
    include: { user: true }
  })
  
  if (!prefs.length) return { sent: 0 }

  let count = 0
  for (const pref of prefs) {
    // Respect threshold if set
    if (pref.starThreshold !== null && rating > pref.starThreshold) {
      continue
    }

    const subject = `New ${platform} review${locationName ? ' - ' + locationName : ''}`
    const summary = `${author ? author + ' • ' : ''}${rating}★\n${content}${reviewUrl ? '\n' + reviewUrl : ''}`

    // Email alert
    if (pref.channelEmail && pref.user?.email) {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Rating:</strong> ${rating}★</p>
            <p><strong>Author:</strong> ${author || 'Anonymous'}</p>
            <p><strong>Review:</strong></p>
            <p style="font-style: italic;">"${content}"</p>
          </div>
          <div style="margin: 20px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/reviews" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Generate Reply
            </a>
          </div>
          ${reviewUrl ? `<p><a href="${reviewUrl}">View original review</a></p>` : ''}
        </div>
      `
      
      try {
        await sendEmail(pref.user.email, subject, html)
        count++
      } catch (error) {
        console.error('Failed to send email alert:', error)
      }
    }

    // WhatsApp alert
    if (pref.channelWhatsApp && pref.whatsappNumber) {
      const whatsappMessage = `🔔 ${subject}\n\n${summary}\n\nReply: ${process.env.APP_URL || 'http://localhost:3000'}/reviews`
      
      try {
        await sendWhatsApp(pref.whatsappNumber, whatsappMessage)
        count++
      } catch (error) {
        console.error('Failed to send WhatsApp alert:', error)
      }
    }
  }

  return { sent: count }
}

export async function sendDailyDigestForOrg(orgId: string) {
  // TODO: Implement daily digest functionality
  console.log('Daily digest for org:', orgId)
  return { sent: 0 }
}


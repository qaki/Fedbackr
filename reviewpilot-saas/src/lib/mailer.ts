import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@reviewpilot.app'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!SENDGRID_API_KEY) {
    console.error('SendGrid not configured. Skipping email send.')
    return { ok: false, skipped: true }
  }
  try {
    await sgMail.send({ to, from: EMAIL_FROM, subject, html })
    return { ok: true }
  } catch (error) {
    console.error('sendEmail error', error)
    return { ok: false }
  }
}


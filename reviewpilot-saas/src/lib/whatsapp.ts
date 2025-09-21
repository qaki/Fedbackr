import twilio from 'twilio'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM // e.g. 'whatsapp:+14155238886'

let client: twilio.Twilio | null = null
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
}

export async function sendWhatsApp(to: string, body: string) {
  if (!client || !TWILIO_WHATSAPP_FROM) {
    console.error('Twilio WhatsApp not configured. Skipping send.')
    return { ok: false, skipped: true }
  }
  try {
    await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to.startsWith('whatsapp:') ? to.slice('whatsapp:'.length) : to}`,
      body,
    })
    return { ok: true }
  } catch (error) {
    console.error('sendWhatsApp error', error)
    return { ok: false }
  }
}


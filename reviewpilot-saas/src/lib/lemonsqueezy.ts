import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

// Initialize Lemon Squeezy
lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
  onError: (error) => console.error('Lemon Squeezy Error:', error),
})

export { lemonSqueezySetup }

// Lemon Squeezy constants and helpers
export const LS_BASE = 'https://api.lemonsqueezy.com/v1'

export function lsHeaders() {
  return {
    'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  }
}

export function appUrl(path: string) {
  const baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}

# ReviewPilot Deployment Guide

This guide covers deploying ReviewPilot to Vercel with all necessary configurations.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/reviewpilot-saas)

## 📋 Prerequisites

- Vercel account
- Neon PostgreSQL database
- Google OAuth credentials
- Lemon Squeezy account
- SendGrid account (for emails)
- Twilio account (for WhatsApp)

## 🔧 Environment Variables

Set these environment variables in your Vercel project settings:

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID="your-google-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-google-client-secret"

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY="your-lemon-squeezy-api-key"
LEMON_SQUEEZY_WEBHOOK_SECRET="your-webhook-secret"

# Encryption
APP_ENCRYPTION_KEY="your-32-character-encryption-key"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_WHATSAPP_NUMBER="+14155238886"

# OpenAI (for AI responses)
OPENAI_API_KEY="your-openai-api-key"

# App Configuration
APP_URL="https://your-domain.vercel.app"
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_CRON_JOBS="true"
```

## 🗄️ Database Setup

1. **Create Neon Database:**
   ```bash
   # Install Neon CLI
   npm install -g @neondatabase/cli
   
   # Create database
   neon projects create reviewpilot
   ```

2. **Run Migrations:**
   ```bash
   # Set DATABASE_URL in your local .env
   npx prisma migrate deploy
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## 🔐 Security Configuration

### Generate Encryption Key

```bash
# Generate a secure 32-character hex key
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Business Profile API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/api/google/oauth/callback`
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Lemon Squeezy Setup

1. Create a store in Lemon Squeezy
2. Create a product with variant ID
3. Set up webhook endpoint: `https://your-domain.vercel.app/api/ls/webhook`
4. Configure webhook events:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`

## 📊 Monitoring & Health Checks

### Health Check Endpoint

The app includes a health check endpoint at `/api/health` that monitors:

- Database connectivity
- Environment variables
- Service status
- Response times

### Uptime Monitoring

Configure your uptime monitoring service to check:
- `https://your-domain.vercel.app/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "abc123",
  "environment": "production",
  "database": {
    "status": "connected",
    "latency": "45ms"
  },
  "environment_variables": {
    "status": "complete",
    "missing": []
  },
  "services": {
    "database": "operational",
    "api": "operational",
    "webhooks": "operational"
  }
}
```

## ⏰ Cron Jobs

Vercel automatically runs these cron jobs:

- **Reviews Sync**: Every 15 minutes (`/api/cron/reviews-sync`)
- **Daily Alerts**: Daily at 9 AM UTC (`/api/cron/alerts-daily`)

## 🔗 Webhooks

### Lemon Squeezy Webhook

Endpoint: `https://your-domain.vercel.app/api/ls/webhook`

Handles subscription events and updates the database automatically.

### Webhook Security

All webhooks are secured with HMAC signatures:
- Lemon Squeezy: Uses `x-signature` header
- Future Stripe integration: Uses `stripe-signature` header

## 🚀 Deployment Steps

1. **Fork/Clone Repository:**
   ```bash
   git clone https://github.com/your-org/reviewpilot-saas.git
   cd reviewpilot-saas
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables listed above

5. **Run Database Migrations:**
   ```bash
   # After deployment, run migrations
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

## 🧪 Testing Deployment

1. **Health Check:**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Test Webhook:**
   ```bash
   # Test with curl (replace with actual webhook data)
   curl -X POST https://your-domain.vercel.app/api/ls/webhook \
     -H "Content-Type: application/json" \
     -H "x-signature: your-signature" \
     -d '{"test": "data"}'
   ```

3. **Test Cron Job:**
   ```bash
   curl https://your-domain.vercel.app/api/cron/reviews-sync
   ```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check `DATABASE_URL` format
   - Ensure database is accessible from Vercel
   - Run `npx prisma migrate deploy`

2. **OAuth Redirect Mismatch:**
   - Verify redirect URIs in Google Console
   - Check `NEXTAUTH_URL` matches your domain

3. **Webhook Signature Verification Failed:**
   - Verify `LEMON_SQUEEZY_WEBHOOK_SECRET`
   - Check webhook URL in Lemon Squeezy dashboard

4. **Cron Jobs Not Running:**
   - Ensure `vercel.json` is in project root
   - Check Vercel Pro plan (required for cron jobs)
   - Verify cron schedule format

### Logs

View logs in Vercel Dashboard:
- Go to Project → Functions → View Function Logs
- Check for errors in cron job executions
- Monitor webhook processing

## 📈 Performance Optimization

### Vercel Configuration

The `vercel.json` includes:
- 30-second function timeout
- 1GB memory allocation
- Optimized for API routes

### Database Optimization

- Connection pooling enabled
- Indexes on frequently queried fields
- Soft deletes for data preservation

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit secrets to git
   - Use Vercel's environment variable encryption
   - Rotate keys regularly

2. **API Security:**
   - All routes protected with authentication
   - Role-based access control
   - Rate limiting on public endpoints

3. **Data Protection:**
   - Sensitive tokens encrypted at rest
   - Audit logging for all actions
   - GDPR-compliant data handling

## 📞 Support

- **Status Page**: https://status.reviewpilot.com
- **Documentation**: https://docs.reviewpilot.com
- **Support Email**: support@reviewpilot.com

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring alerts
2. Configure backup strategies
3. Set up staging environment
4. Implement CI/CD pipeline
5. Add performance monitoring

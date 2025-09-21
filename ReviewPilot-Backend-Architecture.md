# ReviewPilot - Backend & Database Architecture Document

## Overview
This document outlines the complete backend architecture for ReviewPilot, a SaaS platform for online review management. The system is designed to handle review monitoring, AI response generation, real-time notifications, and multi-tenant business management.

---

## 1. Technology Stack

### 1.1 Core Backend Technologies
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15+ (via Neon or Supabase)
- **ORM**: Prisma (for type-safe database operations)
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi for request validation

### 1.2 Supporting Services
- **Cache**: Redis (for sessions and rate limiting)
- **Queue**: Bull Queue with Redis (for background jobs)
- **File Storage**: AWS S3 (for file uploads and backups)
- **Monitoring**: Winston for logging, Sentry for error tracking
- **Testing**: Jest for unit tests, Supertest for API tests

### 1.3 Third-Party Integrations
- **AI/ML**: OpenAI GPT-4 API
- **Review Platforms**: Google My Business API, Yelp Fusion API, Facebook Graph API
- **Notifications**: Twilio (SMS), SendGrid (Email), WhatsApp Business API
- **Payments**: Stripe API
- **Analytics**: Google Cloud Natural Language API

---

## 2. API Design

### 2.1 API Structure
**Base URL**: `https://api.reviewpilot.com/v1`
**Authentication**: Bearer token in Authorization header
**Content-Type**: `application/json`

### 2.2 Core Endpoints

#### Authentication Endpoints
```typescript
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
```

#### User Management
```typescript
GET /users/profile
PUT /users/profile
GET /users/team
POST /users/team/invite
PUT /users/team/:userId/role
DELETE /users/team/:userId
```

#### Business Management
```typescript
GET /businesses
POST /businesses
GET /businesses/:id
PUT /businesses/:id
DELETE /businesses/:id
POST /businesses/:id/connect-platform
DELETE /businesses/:id/platforms/:platform
```

#### Review Management
```typescript
GET /reviews
GET /reviews/:id
POST /reviews/:id/respond
PUT /reviews/:id/response
DELETE /reviews/:id/response
GET /reviews/analytics
POST /reviews/sync
```

#### AI Response Generation
```typescript
POST /ai/generate-response
POST /ai/customize-response
GET /ai/response-templates
POST /ai/response-templates
PUT /ai/response-templates/:id
DELETE /ai/response-templates/:id
```

#### Alerts & Notifications
```typescript
GET /alerts/settings
PUT /alerts/settings
POST /alerts/test
GET /alerts/history
POST /alerts/webhook
```

#### Billing & Subscriptions
```typescript
GET /billing/plans
GET /billing/current-plan
POST /billing/upgrade
POST /billing/downgrade
GET /billing/history
POST /billing/webhook
```

### 2.3 Example API Requests/Responses

#### GET /reviews
**Request:**
```http
GET /api/v1/reviews?platform=google&rating=1-3&limit=20&offset=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_123",
        "businessId": "biz_456",
        "platform": "google",
        "customerName": "John Doe",
        "rating": 2,
        "text": "Poor service, will not return",
        "date": "2024-01-15T10:30:00Z",
        "sentiment": "negative",
        "response": {
          "id": "resp_789",
          "text": "Thank you for your feedback...",
          "date": "2024-01-15T11:00:00Z"
        },
        "metadata": {
          "reviewId": "google_rev_123",
          "url": "https://maps.google.com/...",
          "verified": true
        }
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### POST /ai/generate-response
**Request:**
```json
{
  "reviewId": "rev_123",
  "tone": "professional",
  "customInstructions": "Focus on customer service improvement"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "responses": [
      {
        "id": "ai_resp_1",
        "text": "Thank you for bringing this to our attention. We sincerely apologize for the poor service you experienced...",
        "tone": "professional",
        "confidence": 0.92
      },
      {
        "id": "ai_resp_2", 
        "text": "We're sorry to hear about your experience. Your feedback is valuable to us...",
        "tone": "empathetic",
        "confidence": 0.88
      }
    ],
    "usage": {
      "tokens": 150,
      "cost": 0.0003
    }
  }
}
```

#### POST /reviews/:id/respond
**Request:**
```json
{
  "responseText": "Thank you for your feedback. We apologize for the inconvenience...",
  "postToPlatform": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "responseId": "resp_789",
    "posted": true,
    "platformResponse": {
      "success": true,
      "platformId": "google_resp_456",
      "url": "https://maps.google.com/..."
    }
  }
}
```

---

## 3. Database Schema

### 3.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'staff')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Businesses Table
```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    website TEXT,
    description TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_name ON businesses(name);
```

#### Business Members Table
```sql
CREATE TABLE business_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

CREATE INDEX idx_business_members_business_id ON business_members(business_id);
CREATE INDEX idx_business_members_user_id ON business_members(user_id);
```

#### Platform Connections Table
```sql
CREATE TABLE platform_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'tripadvisor')),
    platform_business_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    connection_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, platform)
);

CREATE INDEX idx_platform_connections_business_id ON platform_connections(business_id);
CREATE INDEX idx_platform_connections_platform ON platform_connections(platform);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'tripadvisor')),
    platform_review_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    title VARCHAR(500),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    sentiment_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    is_responded BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, platform, platform_review_id)
);

CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_platform ON reviews(platform);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_date ON reviews(date);
CREATE INDEX idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX idx_reviews_is_responded ON reviews(is_responded);
```

#### Review Responses Table
```sql
CREATE TABLE review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(100),
    ai_confidence DECIMAL(3,2),
    platform_response_id VARCHAR(255),
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_review_responses_review_id ON review_responses(review_id);
CREATE INDEX idx_review_responses_user_id ON review_responses(user_id);
CREATE INDEX idx_review_responses_posted_at ON review_responses(posted_at);
```

#### Alerts Table
```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_review', 'negative_review', 'response_needed', 'digest')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    channels JSONB DEFAULT '[]',
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_business_id ON alerts(business_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
```

#### Alert Settings Table
```sql
CREATE TABLE alert_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('new_review', 'negative_review', 'response_needed', 'digest')),
    enabled BOOLEAN DEFAULT TRUE,
    channels JSONB DEFAULT '[]',
    conditions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id, type)
);

CREATE INDEX idx_alert_settings_business_id ON alert_settings(business_id);
CREATE INDEX idx_alert_settings_user_id ON alert_settings(user_id);
```

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('trial', 'starter', 'pro', 'agency')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 3.2 Database Relationships
```sql
-- Foreign Key Constraints
ALTER TABLE businesses ADD CONSTRAINT fk_businesses_owner 
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE business_members ADD CONSTRAINT fk_business_members_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE business_members ADD CONSTRAINT fk_business_members_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE platform_connections ADD CONSTRAINT fk_platform_connections_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE review_responses ADD CONSTRAINT fk_review_responses_review 
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;

ALTER TABLE review_responses ADD CONSTRAINT fk_review_responses_user 
    FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE alerts ADD CONSTRAINT fk_alerts_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE alert_settings ADD CONSTRAINT fk_alert_settings_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;

ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_business 
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;
```

---

## 4. Third-Party API Integrations

### 4.1 Google My Business API
```typescript
// Google My Business API Integration
class GoogleMyBusinessService {
  private client: any;
  
  constructor() {
    this.client = google.mybusiness({
      version: 'v4',
      auth: new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
    });
  }

  async connectBusiness(accessToken: string, refreshToken: string) {
    this.client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    const accounts = await this.client.accounts.list();
    return accounts.data.accounts;
  }

  async getReviews(accountId: string, locationId: string) {
    const reviews = await this.client.accounts.locations.reviews.list({
      parent: `accounts/${accountId}/locations/${locationId}`
    });
    
    return reviews.data.reviews;
  }

  async postResponse(accountId: string, locationId: string, reviewName: string, responseText: string) {
    const response = await this.client.accounts.locations.reviews.updateReply({
      name: reviewName,
      requestBody: {
        comment: responseText
      }
    });
    
    return response.data;
  }
}
```

### 4.2 Yelp Fusion API
```typescript
// Yelp Fusion API Integration
class YelpService {
  private apiKey: string;
  private baseUrl = 'https://api.yelp.com/v3';

  constructor() {
    this.apiKey = process.env.YELP_API_KEY;
  }

  async getBusinessReviews(businessId: string) {
    const response = await fetch(`${this.baseUrl}/businesses/${businessId}/reviews`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  async searchBusiness(term: string, location: string) {
    const response = await fetch(`${this.baseUrl}/businesses/search?term=${term}&location=${location}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
```

### 4.3 OpenAI API Integration
```typescript
// OpenAI API Integration
class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateResponse(reviewText: string, businessContext: any, tone: string = 'professional') {
    const prompt = this.buildPrompt(reviewText, businessContext, tone);
    
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional customer service representative helping businesses respond to online reviews.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return {
      text: completion.choices[0].message.content,
      usage: completion.usage,
      model: 'gpt-4'
    };
  }

  private buildPrompt(reviewText: string, businessContext: any, tone: string): string {
    return `
      Business: ${businessContext.name}
      Type: ${businessContext.type}
      Review: ${reviewText}
      Tone: ${tone}
      
      Generate 3 professional responses to this review. Each response should be:
      - Appropriate for the business type
      - Match the requested tone
      - Address the customer's concerns
      - Maintain a professional brand voice
    `;
  }
}
```

### 4.4 API Key Management
```typescript
// Secure API Key Management
class ApiKeyManager {
  private encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY;
  }

  encryptApiKey(apiKey: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(apiKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptApiKey(encryptedApiKey: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encryptedApiKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async storeApiKey(businessId: string, platform: string, apiKey: string) {
    const encryptedKey = this.encryptApiKey(apiKey);
    
    await prisma.platformConnection.upsert({
      where: {
        businessId_platform: {
          businessId,
          platform
        }
      },
      update: {
        accessToken: encryptedKey,
        updatedAt: new Date()
      },
      create: {
        businessId,
        platform,
        accessToken: encryptedKey
      }
    });
  }
}
```

---

## 5. Notifications & Webhooks

### 5.1 Notification Service
```typescript
// Notification Service
class NotificationService {
  private twilioClient: any;
  private sendGridClient: any;

  constructor() {
    this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    this.sendGridClient = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, html: string, businessId: string) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL,
      subject,
      html,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    };

    await this.sendGridClient.send(msg);
    
    // Log notification
    await this.logNotification(businessId, 'email', { to, subject });
  }

  async sendSMS(to: string, message: string, businessId: string) {
    const result = await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    await this.logNotification(businessId, 'sms', { to, messageId: result.sid });
    
    return result;
  }

  async sendWhatsApp(to: string, message: string, businessId: string) {
    const result = await this.twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });

    await this.logNotification(businessId, 'whatsapp', { to, messageId: result.sid });
    
    return result;
  }

  private async logNotification(businessId: string, channel: string, data: any) {
    await prisma.alert.create({
      data: {
        businessId,
        type: 'notification_sent',
        title: `Notification sent via ${channel}`,
        message: JSON.stringify(data),
        channels: [channel],
        sentAt: new Date()
      }
    });
  }
}
```

### 5.2 Webhook Handlers
```typescript
// Webhook Handlers
class WebhookService {
  async handleGoogleWebhook(req: Request, res: Response) {
    const { businessId, reviewId, action } = req.body;
    
    if (action === 'review.created') {
      await this.processNewReview(businessId, reviewId, 'google');
    }
    
    res.status(200).json({ success: true });
  }

  async handleYelpWebhook(req: Request, res: Response) {
    const { businessId, reviewId, event } = req.body;
    
    if (event === 'review.created') {
      await this.processNewReview(businessId, reviewId, 'yelp');
    }
    
    res.status(200).json({ success: true });
  }

  async handleStripeWebhook(req: Request, res: Response) {
    const event = req.body;
    
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
    }
    
    res.status(200).json({ received: true });
  }

  private async processNewReview(businessId: string, reviewId: string, platform: string) {
    // Fetch review details from platform API
    const review = await this.fetchReviewFromPlatform(platform, reviewId);
    
    // Store in database
    await prisma.review.create({
      data: {
        businessId,
        platform,
        platformReviewId: reviewId,
        customerName: review.customerName,
        rating: review.rating,
        text: review.text,
        date: review.date,
        sentiment: review.sentiment,
        metadata: review.metadata
      }
    });

    // Trigger alerts
    await this.triggerReviewAlerts(businessId, review);
  }
}
```

### 5.3 Background Job Processing
```typescript
// Background Job Processing with Bull Queue
import Queue from 'bull';

class JobProcessor {
  private reviewSyncQueue: Queue.Queue;
  private alertQueue: Queue.Queue;
  private aiResponseQueue: Queue.Queue;

  constructor() {
    this.reviewSyncQueue = new Queue('review sync', process.env.REDIS_URL);
    this.alertQueue = new Queue('alerts', process.env.REDIS_URL);
    this.aiResponseQueue = new Queue('ai responses', process.env.REDIS_URL);
    
    this.setupProcessors();
  }

  private setupProcessors() {
    // Review sync processor
    this.reviewSyncQueue.process('sync-reviews', async (job) => {
      const { businessId, platform } = job.data;
      await this.syncReviews(businessId, platform);
    });

    // Alert processor
    this.alertQueue.process('send-alert', async (job) => {
      const { businessId, alertType, data } = job.data;
      await this.sendAlert(businessId, alertType, data);
    });

    // AI response processor
    this.aiResponseQueue.process('generate-response', async (job) => {
      const { reviewId, options } = job.data;
      await this.generateAIResponse(reviewId, options);
    });
  }

  async scheduleReviewSync(businessId: string, platform: string) {
    await this.reviewSyncQueue.add('sync-reviews', { businessId, platform }, {
      repeat: { cron: '*/15 * * * *' }, // Every 15 minutes
      jobId: `${businessId}-${platform}`
    });
  }

  async scheduleAlert(businessId: string, alertType: string, data: any, delay: number = 0) {
    await this.alertQueue.add('send-alert', { businessId, alertType, data }, {
      delay
    });
  }
}
```

---

## 6. Deployment Strategy

### 6.1 Frontend Deployment (Vercel)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.reviewpilot.com",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe-publishable-key",
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID": "@google-client-id"
  },
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### 6.2 Backend Deployment (Render)
```yaml
# render.yaml
services:
  - type: web
    name: reviewpilot-api
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: reviewpilot-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: reviewpilot-redis
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: OPENAI_API_KEY
        sync: false
      - key: STRIPE_SECRET_KEY
        sync: false
      - key: TWILIO_ACCOUNT_SID
        sync: false
      - key: SENDGRID_API_KEY
        sync: false

databases:
  - name: reviewpilot-db
    plan: starter
    databaseName: reviewpilot
    user: reviewpilot_user

  - name: reviewpilot-redis
    plan: starter
```

### 6.3 Environment Configuration
```typescript
// config/environment.ts
export const config = {
  development: {
    database: {
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/reviewpilot_dev'
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    api: {
      port: process.env.PORT || 3001,
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001']
      }
    }
  },
  production: {
    database: {
      url: process.env.DATABASE_URL
    },
    redis: {
      url: process.env.REDIS_URL
    },
    api: {
      port: process.env.PORT || 3001,
      cors: {
        origin: ['https://reviewpilot.com', 'https://www.reviewpilot.com']
      }
    }
  }
};
```

### 6.4 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.5 Monitoring & Logging
```typescript
// monitoring/logger.ts
import winston from 'winston';
import Sentry from '@sentry/node';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'reviewpilot-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Sentry configuration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

export { logger, Sentry };
```

---

## 7. Security Considerations

### 7.1 Authentication & Authorization
```typescript
// JWT Authentication Middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based Authorization
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 7.2 Rate Limiting
```typescript
// Rate Limiting with Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

export { limiter };
```

### 7.3 Data Validation
```typescript
// Request Validation with Joi
import Joi from 'joi';

export const validateReviewResponse = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    responseText: Joi.string().min(10).max(1000).required(),
    postToPlatform: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

---

*This backend architecture provides a robust, scalable foundation for ReviewPilot, ensuring secure API integrations, efficient data management, and reliable deployment processes.*

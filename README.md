# ReviewPilot 🚀

**The Complete Online Reputation Management Platform for Small Businesses**

ReviewPilot is a comprehensive SaaS platform that helps small and medium-sized businesses monitor, manage, and respond to online reviews across multiple platforms. Transform your online reputation management from a time-consuming manual process into an automated, intelligent system.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qaki/Fedbackr)

## 🌟 Key Features

- **🔄 Multi-Platform Monitoring**: Automatically track reviews from Google, Yelp, Facebook, and more
- **🤖 AI-Powered Responses**: Generate professional, brand-consistent replies to reviews
- **⚡ Real-Time Alerts**: Instant notifications for new reviews, especially negative ones
- **📊 Analytics Dashboard**: Comprehensive insights into your review performance
- **💬 WhatsApp Integration**: Respond to reviews directly via WhatsApp
- **🔐 Secure & Compliant**: GDPR-compliant with enterprise-grade security

## 🏗️ Project Architecture

This repository contains multiple components of the ReviewPilot ecosystem:

```
ReviewPilot/
├── 📱 frontend/                    # React frontend application
├── 🔧 backend/                     # Node.js backend API
├── 🚀 reviewpilot-saas/           # Next.js SaaS application (main product)
├── 📋 agents/                     # AI agent definitions
├── 👥 teams/                      # Team configurations
├── 🎮 expansion-packs/            # Specialized development packs
└── 📚 Documentation/              # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn**
- **PostgreSQL database** (Neon recommended)
- **Google OAuth credentials**
- **Lemon Squeezy account** (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/qaki/Fedbackr.git
cd Fedbackr
```

### 2. Set Up the SaaS Application (Main Product)

```bash
cd reviewpilot-saas
npm install
cp env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your credentials:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID="your-google-client-id"
GOOGLE_OAUTH_CLIENT_SECRET="your-google-client-secret"

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY="your-lemon-squeezy-api-key"
LEMON_SQUEEZY_WEBHOOK_SECRET="your-webhook-secret"

# Encryption
APP_ENCRYPTION_KEY="your-32-character-encryption-key"
```

### 4. Set Up Database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Documentation

- **[Product Requirements Document](ReviewPilot-PRD.md)** - Complete product specifications
- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Detailed local development setup
- **[Deployment Guide](reviewpilot-saas/README_DEPLOY.md)** - Production deployment guide
- **[UI/UX Specification](ReviewPilot-UI-UX-Specification.md)** - Design guidelines
- **[User Stories](ReviewPilot-User-Stories.md)** - Feature requirements
- **[User Flows](ReviewPilot-User-Flows.md)** - User journey mapping

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:migrate   # Run database migrations
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### Project Structure

#### Frontend (`/frontend`)
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Google OAuth** integration
- **Responsive design** for all devices

#### Backend (`/backend`)
- **Node.js** with Express
- **RESTful API** design
- **JWT authentication**
- **Database integration**

#### SaaS Application (`/reviewpilot-saas`)
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Prisma** ORM with PostgreSQL
- **NextAuth.js** for authentication
- **Lemon Squeezy** for payments
- **Vercel** deployment ready

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Business Profile API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Database Setup

We recommend using [Neon](https://neon.tech/) for PostgreSQL hosting:

```bash
# Install Neon CLI
npm install -g @neondatabase/cli

# Create database
neon projects create reviewpilot
```

### Payment Integration

Set up [Lemon Squeezy](https://lemonsqueezy.com/) for subscription management:

1. Create a store in Lemon Squeezy
2. Create a product with variant ID
3. Set up webhook endpoint: `https://your-domain.vercel.app/api/ls/webhook`
4. Configure webhook events for subscription management

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qaki/Fedbackr)

1. Click the deploy button above
2. Connect your GitHub account
3. Set environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📊 Features Overview

### For Business Owners
- **Dashboard**: Real-time overview of all reviews
- **Response Management**: AI-generated responses with customization
- **Analytics**: Review trends, sentiment analysis, and performance metrics
- **Alerts**: Instant notifications for new reviews
- **Multi-location Support**: Manage multiple business locations

### For Agencies
- **White-label Solution**: Customizable branding
- **Client Management**: Manage multiple client accounts
- **Reporting**: Comprehensive client reports
- **API Access**: Integrate with existing tools

## 🔒 Security & Compliance

- **GDPR Compliant**: Full data protection compliance
- **SOC 2 Ready**: Enterprise-grade security standards
- **Encrypted Data**: All sensitive data encrypted at rest
- **Secure Authentication**: OAuth 2.0 with JWT tokens
- **Audit Logging**: Complete audit trail for all actions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core review monitoring
- ✅ AI response generation
- ✅ Basic analytics
- ✅ Google OAuth integration

### Phase 2 (Q2 2024)
- 🔄 Advanced analytics dashboard
- 🔄 Multi-platform expansion (Yelp, Facebook)
- 🔄 WhatsApp integration
- 🔄 Mobile app (React Native)

### Phase 3 (Q3 2024)
- 📋 White-label solution
- 📋 API marketplace
- 📋 Advanced AI features
- 📋 Enterprise features

## 🆘 Support

- **Documentation**: [docs.reviewpilot.com](https://docs.reviewpilot.com)
- **Support Email**: support@reviewpilot.com
- **Status Page**: [status.reviewpilot.com](https://status.reviewpilot.com)
- **Community**: [Discord Server](https://discord.gg/reviewpilot)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Vercel** for seamless deployment
- **Prisma** for the excellent ORM
- **Tailwind CSS** for beautiful styling
- **Lemon Squeezy** for payment processing

---

**Made with ❤️ by the ReviewPilot Team**

*Transform your online reputation management today!*

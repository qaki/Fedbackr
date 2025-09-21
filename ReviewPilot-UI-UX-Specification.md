# ReviewPilot - UI/UX Specification Document

## Overview
This document provides comprehensive UI/UX specifications for ReviewPilot, a SaaS platform for online review management. The design follows a modern dark mode aesthetic with neon blue and green accents, built using React.js and TailwindCSS.

---

## 1. Screen Descriptions

### 1.1 Landing Page
**Purpose**: Convert visitors into trial users through clear value proposition and social proof
**Layout**: Full-screen hero section with feature highlights and pricing preview

**UI Elements**:
- **Hero Section**: 
  - Main headline: "Monitor & Respond to Reviews Like a Pro"
  - Subheadline: "AI-powered review management for small businesses"
  - Primary CTA: "Start Free Trial" button
  - Hero image/video: Dashboard preview
- **Features Section**: 3-column grid highlighting core features
- **Social Proof**: Customer testimonials and review counts
- **Pricing Preview**: Basic plan comparison
- **Footer**: Links, legal, contact information

### 1.2 Dashboard (Main Screen)
**Purpose**: Central hub for review monitoring, AI responses, and analytics
**Layout**: Sidebar navigation with main content area

**UI Elements**:
- **DashboardHeader**: Business name, notification bell, user profile dropdown
- **SummaryCards**: 4-card grid showing key metrics
- **RecentReviews**: List of latest reviews with quick actions
- **QuickActions**: Floating action buttons for common tasks
- **AnalyticsChart**: Rating trends and review volume
- **FilterBar**: Platform, rating, date range filters
- **ReviewList**: Paginated list of all reviews

### 1.3 Review Detail Modal
**Purpose**: Detailed view of individual review with response options
**Layout**: Modal overlay with review content and response tools

**UI Elements**:
- **ReviewHeader**: Customer name, rating, date, platform icon
- **ReviewContent**: Full review text with sentiment indicator
- **ResponseSection**: AI response generator and editor
- **ActionButtons**: Post response, mark as read, flag review
- **ResponseHistory**: Previous responses to this review

### 1.4 Business Settings
**Purpose**: Manage business information and connected platforms
**Layout**: Tabbed interface with form sections

**UI Elements**:
- **BusinessInfoForm**: Name, type, address, phone fields
- **PlatformConnections**: Connected accounts with status indicators
- **LocationManagement**: Multi-location support for Pro users
- **BrandVoiceSettings**: AI response customization options
- **TeamMembers**: User management and permissions

### 1.5 Alerts Configuration
**Purpose**: Set up notification preferences and alert rules
**Layout**: Card-based settings with toggle switches

**UI Elements**:
- **AlertChannels**: Email, SMS, WhatsApp toggles
- **AlertRules**: Priority levels and thresholds
- **DigestSettings**: Daily/weekly summary preferences
- **TestAlerts**: Send test notifications
- **AlertHistory**: Recent alert activity

### 1.6 Billing & Plans
**Purpose**: Manage subscription, view usage, and upgrade plans
**Layout**: Plan comparison table with billing history

**UI Elements**:
- **CurrentPlan**: Active plan with usage indicators
- **PlanComparison**: Feature comparison table
- **BillingHistory**: Invoice list with download options
- **PaymentMethod**: Stripe payment form
- **UsageMetrics**: Current month usage statistics

### 1.7 Onboarding Flow
**Purpose**: Guide new users through setup process
**Layout**: Step-by-step wizard with progress indicator

**UI Elements**:
- **ProgressIndicator**: Step counter with completion status
- **WelcomeScreen**: Introduction and value proposition
- **BusinessSetup**: Business information form
- **PlatformConnection**: OAuth integration flows
- **AlertSetup**: Notification preferences
- **TourOverlay**: Interactive feature introduction

---

## 2. Component Library

### 2.1 Core Components

#### `ReviewCard`
**Purpose**: Display individual review with rating and actions
**Props**: `review`, `onRespond`, `onMarkRead`, `isResponded`

```jsx
// TailwindCSS Classes
<div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-400 transition-colors">
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center space-x-3">
      <PlatformIcon platform={review.platform} />
      <div>
        <h4 className="text-white font-medium">{review.customerName}</h4>
        <StarRating rating={review.rating} />
      </div>
    </div>
    <span className="text-gray-400 text-sm">{review.date}</span>
  </div>
  <p className="text-gray-300 mb-4">{review.text}</p>
  <div className="flex space-x-2">
    <Button variant="primary" onClick={onRespond}>Respond</Button>
    <Button variant="secondary" onClick={onMarkRead}>Mark Read</Button>
  </div>
</div>
```

#### `DashboardHeader`
**Purpose**: Top navigation with business info and user controls
**Props**: `businessName`, `notificationCount`, `userProfile`

```jsx
<header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold text-white">{businessName}</h1>
      <span className="bg-green-500 text-black px-2 py-1 rounded-full text-xs font-medium">
        Pro Plan
      </span>
    </div>
    <div className="flex items-center space-x-4">
      <NotificationBell count={notificationCount} />
      <UserProfileDropdown user={userProfile} />
    </div>
  </div>
</header>
```

#### `SummaryCard`
**Purpose**: Display key metrics in dashboard
**Props**: `title`, `value`, `change`, `icon`, `color`

```jsx
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change}% from last month
      </p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
</div>
```

#### `AIResponseGenerator`
**Purpose**: Generate and customize AI responses
**Props**: `review`, `onGenerate`, `onCustomize`, `onPost`

```jsx
<div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
  <h3 className="text-lg font-semibold text-white mb-4">AI Response Generator</h3>
  <div className="space-y-4">
    <Button 
      variant="primary" 
      onClick={onGenerate}
      className="w-full bg-cyan-500 hover:bg-cyan-600"
    >
      Generate AI Response
    </Button>
    {responses.map((response, index) => (
      <div key={index} className="border border-gray-600 rounded-lg p-4">
        <p className="text-gray-300 mb-3">{response.text}</p>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => onCustomize(response)}>
            Customize
          </Button>
          <Button variant="primary" onClick={() => onPost(response)}>
            Use This Response
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### `AlertsToggle`
**Purpose**: Enable/disable notification channels
**Props**: `enabled`, `onToggle`, `label`, `description`

```jsx
<div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg">
  <div>
    <h4 className="text-white font-medium">{label}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-cyan-500' : 'bg-gray-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
</div>
```

### 2.2 Form Components

#### `InputField`
**Purpose**: Standardized form input with validation
**Props**: `label`, `type`, `value`, `onChange`, `error`, `placeholder`

```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">{label}</label>
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
      error ? 'border-red-500' : 'border-gray-600'
    }`}
  />
  {error && <p className="text-red-400 text-sm">{error}</p>}
</div>
```

#### `Button`
**Purpose**: Consistent button styling across the app
**Props**: `variant`, `size`, `disabled`, `onClick`, `children`

```jsx
const Button = ({ variant = 'primary', size = 'md', disabled, onClick, children }) => {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-black focus:ring-cyan-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    success: "bg-green-500 hover:bg-green-600 text-black focus:ring-green-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

### 2.3 Navigation Components

#### `Sidebar`
**Purpose**: Main navigation for dashboard
**Props**: `activeItem`, `onNavigate`, `userRole`

```jsx
<nav className="w-64 bg-gray-900 border-r border-gray-700 h-full">
  <div className="p-6">
    <h2 className="text-lg font-bold text-white mb-6">ReviewPilot</h2>
    <ul className="space-y-2">
      {navigationItems.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              activeItem === item.id 
                ? 'bg-cyan-500 text-black' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  </div>
</nav>
```

#### `Breadcrumb`
**Purpose**: Show current page location
**Props**: `items`

```jsx
<nav className="flex items-center space-x-2 text-sm text-gray-400">
  {items.map((item, index) => (
    <div key={index} className="flex items-center">
      {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
      <span className={index === items.length - 1 ? 'text-white' : 'text-gray-400'}>
        {item.label}
      </span>
    </div>
  ))}
</nav>
```

---

## 3. Design System & Styling

### 3.1 Color Palette

#### Primary Colors
```css
/* Dark Mode Base */
--bg-primary: #111827;      /* gray-900 */
--bg-secondary: #1f2937;    /* gray-800 */
--bg-tertiary: #374151;     /* gray-700 */

/* Text Colors */
--text-primary: #ffffff;    /* white */
--text-secondary: #d1d5db;  /* gray-300 */
--text-muted: #9ca3af;      /* gray-400 */

/* Accent Colors */
--accent-cyan: #06b6d4;     /* cyan-500 */
--accent-cyan-hover: #0891b2; /* cyan-600 */
--accent-green: #10b981;    /* emerald-500 */
--accent-green-hover: #059669; /* emerald-600 */

/* Status Colors */
--success: #10b981;         /* emerald-500 */
--warning: #f59e0b;         /* amber-500 */
--error: #ef4444;           /* red-500 */
--info: #3b82f6;            /* blue-500 */
```

#### TailwindCSS Configuration
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          500: '#06b6d4',
          600: '#0891b2',
          900: '#164e63'
        },
        accent: {
          cyan: '#06b6d4',
          green: '#10b981'
        }
      },
      animation: {
        'pulse-cyan': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      }
    }
  }
}
```

### 3.2 Typography

#### Font System
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Typography Classes
```css
.heading-1 { @apply text-3xl font-bold text-white; }
.heading-2 { @apply text-2xl font-semibold text-white; }
.heading-3 { @apply text-xl font-medium text-white; }
.body-large { @apply text-lg text-gray-300; }
.body-regular { @apply text-base text-gray-300; }
.body-small { @apply text-sm text-gray-400; }
.caption { @apply text-xs text-gray-500; }
```

### 3.3 Spacing & Layout

#### Spacing Scale
```css
/* TailwindCSS Spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

#### Layout Grid
```css
/* Container Sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }

/* Grid System */
.grid-2 { @apply grid grid-cols-1 md:grid-cols-2 gap-6; }
.grid-3 { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }
.grid-4 { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6; }
```

### 3.4 Effects & Animations

#### Shadows & Borders
```css
/* Shadow System */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.shadow-cyan { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3); }
.shadow-green { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }

/* Border System */
.border-primary { border: 1px solid #374151; }
.border-accent { border: 1px solid #06b6d4; }
.border-success { border: 1px solid #10b981; }
.border-error { border: 1px solid #ef4444; }
```

#### Animations
```css
/* Transition Classes */
.transition-all { transition: all 0.2s ease-in-out; }
.transition-colors { transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out; }
.transition-transform { transition: transform 0.2s ease-in-out; }

/* Hover Effects */
.hover-lift { @apply hover:transform hover:-translate-y-1 hover:shadow-lg transition-all; }
.hover-glow { @apply hover:shadow-cyan transition-all; }
.hover-scale { @apply hover:transform hover:scale-105 transition-transform; }
```

---

## 4. Responsive Design

### 4.1 Breakpoint System

#### TailwindCSS Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

### 4.2 Mobile Design (< 768px)

#### Layout Adaptations
```jsx
// Mobile Dashboard Layout
<div className="flex flex-col h-screen">
  {/* Mobile Header */}
  <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold text-white">ReviewPilot</h1>
      <div className="flex items-center space-x-3">
        <NotificationBell />
        <UserProfileDropdown />
      </div>
    </div>
  </header>

  {/* Mobile Navigation Tabs */}
  <nav className="bg-gray-800 border-b border-gray-700 px-4 py-2">
    <div className="flex space-x-4 overflow-x-auto">
      {tabs.map(tab => (
        <button key={tab.id} className="flex-shrink-0 px-3 py-2 text-sm">
          {tab.label}
        </button>
      ))}
    </div>
  </nav>

  {/* Mobile Content */}
  <main className="flex-1 overflow-y-auto p-4">
    <div className="space-y-4">
      {/* Mobile Summary Cards - Stacked */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard title="Total Reviews" value="156" />
        <SummaryCard title="Avg Rating" value="4.3" />
      </div>
      
      {/* Mobile Review List */}
      <div className="space-y-3">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  </main>
</div>
```

#### Mobile-Specific Components
```jsx
// Mobile Review Card
<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
  <div className="flex items-start space-x-3">
    <PlatformIcon platform={review.platform} size="sm" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-medium truncate">{review.customerName}</h4>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-300 text-sm line-clamp-3">{review.text}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-gray-400 text-xs">{review.date}</span>
        <Button size="sm" variant="primary">Respond</Button>
      </div>
    </div>
  </div>
</div>
```

### 4.3 Tablet Design (768px - 1024px)

#### Layout Adaptations
```jsx
// Tablet Dashboard Layout
<div className="flex h-screen">
  {/* Collapsible Sidebar */}
  <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-700 transition-all`}>
    <div className="p-4">
      {sidebarOpen ? (
        <h2 className="text-lg font-bold text-white mb-6">ReviewPilot</h2>
      ) : (
        <div className="w-8 h-8 bg-cyan-500 rounded-lg"></div>
      )}
      <NavigationMenu collapsed={!sidebarOpen} />
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col">
    <DashboardHeader />
    <div className="flex-1 p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Reviews" value="156" />
        <SummaryCard title="Avg Rating" value="4.3" />
        <SummaryCard title="Response Rate" value="78%" />
        <SummaryCard title="New This Week" value="8" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewList />
        </div>
        <div>
          <AnalyticsChart />
        </div>
      </div>
    </div>
  </main>
</div>
```

### 4.4 Desktop Design (> 1024px)

#### Layout Adaptations
```jsx
// Desktop Dashboard Layout
<div className="flex h-screen">
  {/* Full Sidebar */}
  <aside className="w-64 bg-gray-900 border-r border-gray-700">
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-6">ReviewPilot</h2>
      <NavigationMenu />
    </div>
  </aside>

  {/* Main Content Area */}
  <main className="flex-1 flex flex-col">
    <DashboardHeader />
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Reviews" value="156" />
          <SummaryCard title="Avg Rating" value="4.3" />
          <SummaryCard title="Response Rate" value="78%" />
          <SummaryCard title="New This Week" value="8" />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <ReviewList />
          </div>
          <div className="space-y-6">
            <AnalyticsChart />
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

### 4.5 Responsive Utilities

#### TailwindCSS Responsive Classes
```css
/* Responsive Text Sizes */
.text-responsive {
  @apply text-sm md:text-base lg:text-lg;
}

/* Responsive Spacing */
.p-responsive {
  @apply p-4 md:p-6 lg:p-8;
}

/* Responsive Grid */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6;
}

/* Responsive Flex */
.flex-responsive {
  @apply flex flex-col md:flex-row;
}

/* Responsive Visibility */
.mobile-only { @apply block md:hidden; }
.tablet-up { @apply hidden md:block; }
.desktop-only { @apply hidden lg:block; }
```

#### Responsive Component Props
```jsx
// Responsive Component Example
const ResponsiveCard = ({ children, className = "" }) => {
  return (
    <div className={`
      bg-gray-800 border border-gray-700 rounded-lg
      p-4 md:p-6 lg:p-8
      ${className}
    `}>
      {children}
    </div>
  )
}

// Usage with responsive props
<ResponsiveCard className="col-span-1 md:col-span-2 lg:col-span-3">
  <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">
    Responsive Heading
  </h3>
  <p className="text-sm md:text-base text-gray-300 mt-2">
    Responsive content that adapts to screen size
  </p>
</ResponsiveCard>
```

---

## 5. Accessibility & Performance

### 5.1 Accessibility Guidelines

#### WCAG 2.1 AA Compliance
```jsx
// Accessible Button Component
const AccessibleButton = ({ children, onClick, disabled, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      {children}
    </button>
  )
}

// Accessible Form Input
const AccessibleInput = ({ label, id, error, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
```

### 5.2 Performance Optimizations

#### Lazy Loading
```jsx
// Lazy load heavy components
const LazyAnalyticsChart = lazy(() => import('./AnalyticsChart'))
const LazyReviewList = lazy(() => import('./ReviewList'))

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyAnalyticsChart />
</Suspense>
```

#### Image Optimization
```jsx
// Optimized image component
const OptimizedImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="transition-opacity duration-300"
      {...props}
    />
  )
}
```

---

## 6. Implementation Guidelines

### 6.1 Component Structure
```jsx
// Recommended component structure
src/
├── components/
│   ├── ui/           // Basic UI components
│   ├── forms/        // Form-specific components
│   ├── layout/       // Layout components
│   └── features/     // Feature-specific components
├── hooks/            // Custom React hooks
├── utils/            // Utility functions
├── styles/           // Global styles and Tailwind config
└── types/            // TypeScript type definitions
```

### 6.2 Styling Best Practices
```jsx
// Use TailwindCSS classes consistently
const Component = () => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Title</h2>
      <p className="text-gray-300">Content</p>
    </div>
  )
}

// Extract common patterns into utility classes
const cardClasses = "bg-gray-800 border border-gray-700 rounded-lg p-6"
const buttonClasses = "px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg transition-colors"
```

### 6.3 State Management
```jsx
// Use React Context for global state
const AppContext = createContext()

// Use local state for component-specific data
const [reviews, setReviews] = useState([])
const [loading, setLoading] = useState(false)

// Use custom hooks for complex logic
const useReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  
  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getReviews()
      setReviews(data)
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { reviews, loading, fetchReviews }
}
```

---

*This UI/UX specification provides a comprehensive foundation for building the ReviewPilot interface, ensuring consistency, accessibility, and optimal user experience across all devices and screen sizes.*

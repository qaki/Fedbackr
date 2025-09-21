# ReviewPilot - User Flows

## Overview
This document outlines the key user journeys for ReviewPilot, detailing the step-by-step interactions users will have with the platform. Each flow is designed to be intuitive, efficient, and aligned with the user stories and business goals outlined in the PRD.

---

## 1. Onboarding Flow: New User Journey

### Flow Objective
Guide a new user from initial signup through connecting their business accounts and setting up their first alerts, ensuring they experience immediate value from the platform.

### User Persona
**Sarah - Restaurant Owner** (Primary target user)
- First-time user of ReviewPilot
- Has Google My Business and Yelp accounts
- Wants to start monitoring reviews immediately

### Step-by-Step Flow

#### **Step 1: Landing Page & Signup**
**Screen**: Landing Page
- **User Action**: Clicks "Start Free Trial" button
- **System Response**: Redirects to signup page

**Screen**: Signup Page
- **User Action**: 
  - Enters email address
  - Creates password
  - Clicks "Start 14-Day Free Trial"
- **System Response**: 
  - Validates email format
  - Checks password strength
  - Creates account and redirects to welcome screen

#### **Step 2: Welcome & Business Setup**
**Screen**: Welcome Screen
- **User Action**: Clicks "Get Started" button
- **System Response**: Shows business information form

**Screen**: Business Information Form
- **User Action**:
  - Enters business name: "Sarah's Bistro"
  - Selects business type: "Restaurant"
  - Enters business address
  - Clicks "Continue"
- **System Response**: Validates information and shows platform connection options

#### **Step 3: Platform Connection**
**Screen**: Connect Your Business Accounts
- **User Action**: Clicks "Connect Google My Business" button
- **System Response**: Opens Google OAuth popup

**Screen**: Google OAuth Popup
- **User Action**: 
  - Logs into Google account
  - Selects "Sarah's Bistro" business
  - Grants permissions
- **System Response**: 
  - Closes popup
  - Shows "Google Connected" with green checkmark
  - Displays "Connect Yelp" option

**Screen**: Yelp Connection
- **User Action**: Clicks "Connect Yelp" button
- **System Response**: Opens Yelp API authentication

**Screen**: Yelp Authentication
- **User Action**: 
  - Enters Yelp business URL
  - Verifies business ownership
  - Grants API access
- **System Response**: 
  - Validates connection
  - Shows "Yelp Connected" with green checkmark
  - Displays "Continue to Dashboard" button

#### **Step 4: Initial Review Import**
**Screen**: Importing Reviews
- **User Action**: Waits for import process
- **System Response**: 
  - Shows progress bar: "Importing 47 reviews from Google, 23 from Yelp..."
  - Displays estimated time: "2 minutes remaining"
  - Shows sample review cards as they're imported

#### **Step 5: Alert Setup**
**Screen**: Set Up Your Alerts
- **User Action**: 
  - Toggles "Email alerts" to ON
  - Enters email address (pre-filled)
  - Selects "Immediate alerts for all reviews"
  - Clicks "Save Alert Settings"
- **System Response**: 
  - Confirms alert setup
  - Shows "Test Alert" button

**Screen**: Test Alert Confirmation
- **User Action**: Clicks "Send Test Alert"
- **System Response**: 
  - Sends test email
  - Shows "Test alert sent! Check your email"
  - Displays "Go to Dashboard" button

#### **Step 6: Dashboard Introduction**
**Screen**: Dashboard with Onboarding Overlay
- **User Action**: Clicks "Take a Tour" button
- **System Response**: Shows interactive tour highlighting:
  - Review cards and ratings
  - AI response generator
  - Alert settings
  - Analytics section

**Screen**: Tour Completion
- **User Action**: Clicks "Start Using ReviewPilot"
- **System Response**: 
  - Removes onboarding overlay
  - Shows full dashboard
  - Displays success message: "Welcome to ReviewPilot! You're now monitoring 70 reviews across 2 platforms."

### Success Metrics
- **Completion Rate**: 85% of users complete full onboarding
- **Time to Value**: Users see their first reviews within 5 minutes
- **Platform Connection**: 90% connect at least one platform
- **Alert Setup**: 75% configure alerts during onboarding

---

## 2. Dashboard Experience Flow: Returning User

### Flow Objective
Provide an efficient, informative dashboard experience that allows users to quickly review their reputation status, respond to reviews, and access key insights.

### User Persona
**Mike - Salon Owner** (Returning user)
- Has been using ReviewPilot for 2 weeks
- Connected Google and Yelp accounts
- Wants to check new reviews and respond to feedback

### Step-by-Step Flow

#### **Step 1: Login**
**Screen**: Login Page
- **User Action**: 
  - Enters email and password
  - Clicks "Sign In"
- **System Response**: 
  - Validates credentials
  - Redirects to dashboard

#### **Step 2: Dashboard Overview**
**Screen**: Main Dashboard
- **User Action**: Reviews dashboard layout
- **System Response**: Displays:
  - **Header**: Business name, notification bell (2 new alerts), user profile
  - **Summary Cards**: Total reviews (156), Average rating (4.3), New this week (8)
  - **Recent Reviews Section**: 5 most recent reviews with platform icons
  - **Quick Actions**: "Generate Response", "View All Reviews", "Settings"

#### **Step 3: Review Filtering**
**Screen**: Reviews List View
- **User Action**: Clicks "View All Reviews" button
- **System Response**: Shows full reviews list with filters

**Screen**: Filtered Reviews
- **User Action**: 
  - Clicks "Platform" filter dropdown
  - Selects "Yelp only"
  - Clicks "Rating" filter
  - Selects "4-5 stars"
- **System Response**: 
  - Updates list to show only 4-5 star Yelp reviews
  - Shows count: "Showing 23 of 156 reviews"
  - Highlights active filters

#### **Step 4: Review Interaction**
**Screen**: Individual Review Card
- **User Action**: Clicks on a 4-star Yelp review
- **System Response**: Expands review card showing:
  - Full review text
  - Customer name and date
  - "Generate AI Response" button
  - "Mark as Read" option

#### **Step 5: AI Response Generation**
**Screen**: AI Response Generator
- **User Action**: Clicks "Generate AI Response" button
- **System Response**: Shows loading state: "Analyzing review and generating response..."

**Screen**: AI Response Options
- **User Action**: Reviews 3 AI-generated response options
- **System Response**: Displays:
  - **Option 1**: Professional, formal tone
  - **Option 2**: Friendly, conversational tone  
  - **Option 3**: Grateful, appreciative tone
  - Each with "Edit" and "Use This Response" buttons

#### **Step 6: Response Customization**
**Screen**: Response Editor
- **User Action**: 
  - Clicks "Edit" on Option 2 (friendly tone)
  - Modifies text: "Thank you so much for the wonderful review!" → "Thank you so much for the amazing review!"
  - Clicks "Save Changes"
- **System Response**: 
  - Updates response text
  - Shows character count: "127/500 characters"
  - Displays "Post Response" button

#### **Step 7: Response Posting**
**Screen**: Post Confirmation
- **User Action**: Clicks "Post Response" button
- **System Response**: Shows confirmation dialog:
  - "Post this response to Yelp?"
  - Response preview
  - "Post" and "Cancel" buttons

**Screen**: Posting Status
- **User Action**: Clicks "Post" in confirmation
- **System Response**: 
  - Shows "Posting to Yelp..." with spinner
  - Updates to "Response posted successfully!"
  - Marks review as "Responded" with green checkmark

#### **Step 8: Analytics Review**
**Screen**: Analytics Section
- **User Action**: Clicks "Analytics" tab
- **System Response**: Shows:
  - **Rating Trend Chart**: 30-day rating progression
  - **Review Volume**: Weekly review counts
  - **Response Rate**: 78% of reviews responded to
  - **Platform Breakdown**: Google (65%), Yelp (35%)

### Success Metrics
- **Session Duration**: Average 8-12 minutes per session
- **Response Rate**: 80% of users respond to at least one review
- **Filter Usage**: 60% use filtering features
- **AI Adoption**: 90% use AI response generator

---

## 3. Alerts & Responses Flow: Notification to Action

### Flow Objective
Enable users to quickly respond to review alerts, especially negative reviews, to maintain their online reputation.

### User Persona
**Lisa - Service Provider** (Alert recipient)
- Receives email alert for negative review
- Wants to respond quickly to address customer concern
- Uses mobile device for quick response

### Step-by-Step Flow

#### **Step 1: Alert Reception**
**Screen**: Email Alert (Mobile)
- **User Action**: Receives email notification
- **System Response**: Email contains:
  - Subject: "⚠️ New 2-star review for Lisa's Consulting"
  - Review snippet and customer name
  - "View & Respond" button
  - "View in Dashboard" link

#### **Step 2: Mobile Dashboard Access**
**Screen**: Mobile Login
- **User Action**: 
  - Clicks "View & Respond" in email
  - Redirected to mobile login
  - Enters credentials quickly
- **System Response**: 
  - Validates login
  - Redirects to specific review

#### **Step 3: Review Details**
**Screen**: Mobile Review Detail
- **User Action**: Reviews full negative review
- **System Response**: Shows:
  - **Alert Badge**: "URGENT: 2-star review"
  - **Full Review Text**: Customer complaint about service
  - **Customer Info**: Name, date, platform (Google)
  - **Quick Actions**: "Generate Response", "Mark as Read"

#### **Step 4: AI Response Generation**
**Screen**: AI Response Generator (Mobile)
- **User Action**: Clicks "Generate Response" button
- **System Response**: Shows:
  - "Generating professional response..."
  - Loading spinner
  - "This may take 10-15 seconds"

**Screen**: AI Response Options (Mobile)
- **User Action**: Reviews 3 response options
- **System Response**: Displays:
  - **Option 1**: Apologetic, solution-focused
  - **Option 2**: Professional, investigation-focused
  - **Option 3**: Empathetic, resolution-focused
  - Swipe to view options

#### **Step 5: Response Selection & Edit**
**Screen**: Response Editor (Mobile)
- **User Action**: 
  - Selects Option 3 (empathetic tone)
  - Taps "Edit Response"
  - Adds personal touch: "I'd like to personally address this concern"
  - Taps "Save"
- **System Response**: 
  - Updates response text
  - Shows character count
  - Displays "Post Response" button

#### **Step 6: Response Posting**
**Screen**: Post Confirmation (Mobile)
- **User Action**: Taps "Post Response"
- **System Response**: Shows:
  - "Post this response to Google?"
  - Response preview in modal
  - "Post" and "Cancel" buttons

**Screen**: Posting Status
- **User Action**: Taps "Post"
- **System Response**: 
  - Shows "Posting to Google..."
  - Updates to "✅ Response posted successfully!"
  - Auto-redirects to dashboard

#### **Step 7: Follow-up Actions**
**Screen**: Dashboard with Success Message
- **User Action**: Reviews posted response
- **System Response**: Shows:
  - **Success Banner**: "Response posted to Google review"
  - **Review Status**: Changed from "Needs Response" to "Responded"
  - **Suggested Actions**: "Set up follow-up reminder", "Review similar complaints"

**Screen**: Follow-up Setup
- **User Action**: Clicks "Set up follow-up reminder"
- **System Response**: Shows:
  - "Remind me to follow up in:"
  - Options: 1 week, 2 weeks, 1 month
  - "Create Reminder" button

### Success Metrics
- **Response Time**: Average 15 minutes from alert to response
- **Mobile Usage**: 70% of alert responses via mobile
- **AI Adoption**: 95% use AI for negative review responses
- **Follow-up Rate**: 60% set up follow-up reminders

---

## 4. Billing & Plans Flow: Subscription Upgrade

### Flow Objective
Guide users through a smooth upgrade process from Starter to Pro plan, highlighting value and ensuring clear pricing communication.

### User Persona
**Sarah - Restaurant Owner** (Upgrading user)
- Currently on Starter plan ($29/month)
- Needs multi-location support and unlimited responses
- Wants to upgrade to Pro plan ($79/month)

### Step-by-Step Flow

#### **Step 1: Upgrade Trigger**
**Screen**: Dashboard with Usage Warning
- **User Action**: Sees banner notification
- **System Response**: Shows:
  - "⚠️ You've used 20 of 25 AI responses this month"
  - "Upgrade to Pro for unlimited responses"
  - "View Plans" button

#### **Step 2: Plan Comparison**
**Screen**: Plans Page
- **User Action**: Clicks "View Plans" or navigates to Billing
- **System Response**: Shows:
  - **Current Plan Highlighted**: Starter ($29/month)
  - **Pro Plan Featured**: Pro ($79/month) with "Most Popular" badge
  - **Feature Comparison Table**: Side-by-side comparison
  - **Upgrade Benefits**: "Unlimited responses", "5 locations", "Advanced analytics"

#### **Step 3: Upgrade Decision**
**Screen**: Pro Plan Details
- **User Action**: Clicks "Upgrade to Pro" button
- **System Response**: Shows:
  - **Pricing Breakdown**: 
    - Current: $29/month (Starter)
    - New: $79/month (Pro)
    - Difference: +$50/month
  - **Proration Info**: "You'll be charged $25 today (prorated)"
  - **Next Billing**: "Next full charge: March 15, 2024"

#### **Step 4: Payment Method**
**Screen**: Payment Information
- **User Action**: Reviews payment details
- **System Response**: Shows:
  - **Current Payment Method**: "•••• 4242 (Visa ending in 4242)"
  - **Update Payment Method** link
  - **Billing Address**: Pre-filled from account
  - **Terms Checkbox**: "I agree to the new pricing"

#### **Step 5: Upgrade Confirmation**
**Screen**: Upgrade Confirmation
- **User Action**: 
  - Checks terms agreement
  - Clicks "Confirm Upgrade"
- **System Response**: Shows:
  - "Processing upgrade..."
  - Loading spinner
  - "This may take a few moments"

#### **Step 6: Upgrade Success**
**Screen**: Upgrade Complete
- **User Action**: Waits for processing
- **System Response**: Shows:
  - **Success Message**: "🎉 Welcome to Pro Plan!"
  - **New Features Unlocked**:
    - "✅ Unlimited AI responses"
    - "✅ Up to 5 business locations"
    - "✅ Advanced analytics"
    - "✅ Priority support"
  - **Next Steps**: "Add another location", "Explore analytics"

#### **Step 7: Feature Activation**
**Screen**: New Features Dashboard
- **User Action**: Clicks "Add another location"
- **System Response**: Shows:
  - **Location Setup**: "Add your second business location"
  - **Platform Connection**: Google, Yelp, Facebook options
  - **Quick Setup**: "Copy settings from main location"

#### **Step 8: Billing Confirmation**
**Screen**: Billing History
- **User Action**: Clicks "Billing" to verify charges
- **System Response**: Shows:
  - **Recent Charges**:
    - "Pro Plan Upgrade (Prorated): $25.00"
    - "Next Billing: March 15, 2024 - $79.00"
  - **Plan Status**: "Pro Plan - Active"
  - **Usage**: "0 of unlimited AI responses used"

### Success Metrics
- **Upgrade Conversion**: 25% of Starter users upgrade within 3 months
- **Upgrade Completion**: 95% complete upgrade process once started
- **Feature Adoption**: 80% use new features within 7 days
- **Retention**: 90% remain on Pro plan after 3 months

---

## 5. Additional User Flows

### 5.1 Agency Client Management Flow
**Objective**: Enable agency owners to manage multiple client accounts efficiently

**Key Steps**:
1. **Client Dashboard**: Overview of all client accounts
2. **Client Selection**: Quick switching between clients
3. **Bulk Actions**: Respond to multiple reviews across clients
4. **White-label Reports**: Generate branded reports for clients
5. **Client Communication**: Send updates and insights to clients

### 5.2 Free Trial to Paid Conversion Flow
**Objective**: Convert free trial users to paid subscribers

**Key Steps**:
1. **Trial Usage Tracking**: Monitor feature usage and engagement
2. **Trial Expiration Alerts**: 3-day, 1-day, and day-of notifications
3. **Value Demonstration**: Show saved time and improved ratings
4. **Plan Selection**: Guide to appropriate plan based on usage
5. **Conversion Incentives**: Limited-time discounts or bonuses

### 5.3 Customer Support Flow
**Objective**: Provide efficient support for user issues

**Key Steps**:
1. **Help Center**: Self-service documentation and FAQs
2. **In-app Support**: Chat widget for immediate assistance
3. **Ticket System**: Formal support request tracking
4. **Video Tutorials**: Step-by-step feature explanations
5. **Community Forum**: User-to-user support and tips

---

## User Flow Optimization Principles

### 1. **Progressive Disclosure**
- Show only essential information at each step
- Reveal advanced features as users become comfortable
- Use tooltips and help text for complex features

### 2. **Mobile-First Design**
- All flows optimized for mobile devices
- Touch-friendly buttons and interactions
- Responsive layouts for all screen sizes

### 3. **Error Prevention & Recovery**
- Clear validation messages
- Confirmation dialogs for destructive actions
- Easy undo/redo functionality where possible

### 4. **Performance Optimization**
- Fast loading times (<3 seconds)
- Progressive loading for large datasets
- Offline capability for critical functions

### 5. **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

---

*These user flows provide a comprehensive foundation for the ReviewPilot user experience, ensuring intuitive navigation and efficient task completion across all key user journeys.*

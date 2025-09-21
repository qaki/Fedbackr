import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  BarChart3, 
  Bot, 
  Bell, 
  Shield, 
  Zap, 
  Users,
  TrendingUp,
  Smartphone,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import CheckoutButton from './CheckoutButton';
import SuccessPage from './SuccessPage';
import OnboardingConnect from './OnboardingConnect';
import OnboardingLocation from './OnboardingLocation';
import OnboardingAlerts from './OnboardingAlerts';
import OAuthCallback from './OAuthCallback';
import './App.css';

// UI Components
const Button = ({ variant = 'primary', size = 'md', disabled, loading, onClick, children, className = '' }) => {
  const baseClasses = "font-medium rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 focus:ring-cyan-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 focus:ring-gray-500",
    outline: "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black focus:ring-cyan-500",
    ghost: "hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-lg font-semibold",
    xl: "px-10 py-4 text-lg font-semibold",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
}

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-cyan-500 text-black",
    secondary: "bg-gray-800 text-gray-300",
    outline: "border border-cyan-500 text-cyan-400",
    success: "bg-green-500 text-black",
  }
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Card = ({ children, className = '', hover = false }) => (
  <div className={`rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm text-gray-100 shadow-xl ${hover ? 'hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10' : ''} ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
)

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-400 ${className}`}>
    {children}
  </p>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
)

// Hero Section
const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge variant="outline" className="mb-4">
              ✈️ ReviewPilot
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Never miss a{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              review
            </span>{" "}
            again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-300 leading-relaxed max-w-2xl"
          >
            AI writes the perfect response in 1 click. Monitor all your reviews, 
            get instant alerts, and maintain your reputation effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="xl" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              See Live Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center space-x-6 text-sm text-gray-400"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              7 days free
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Cancel anytime
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="relative rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 shadow-2xl">
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">✈️</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">ReviewPilot</h3>
                  <p className="text-gray-400 text-sm">Dashboard</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Mock Reviews */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-400 text-sm">Google</span>
                  </div>
                  <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  "Amazing service! The team was professional and efficient. Highly recommend!"
                </p>
                <div className="flex space-x-2">
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                    AI Reply
                  </button>
                  <button className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs transition-colors">
                    Custom
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐⭐⭐⭐</span>
                    <span className="text-gray-400 text-sm">Yelp</span>
                  </div>
                  <span className="text-gray-400 text-xs">2h ago</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  "Good food and atmosphere. Could improve on service speed during peak hours."
                </p>
                <div className="flex space-x-2">
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                    AI Reply
                  </button>
                  <button className="border border-gray-600 text-gray-300 hover:bg-gray-700 px-3 py-1 rounded-lg text-xs transition-colors">
                    Custom
                  </button>
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-xl -z-10" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// Features Section
const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Review Monitoring",
      description: "Monitor all your reviews from Google, Yelp, Facebook, and TripAdvisor in one unified dashboard.",
      badge: "Core Feature",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Bot,
      title: "AI Response Generator",
      description: "Generate professional, personalized responses to reviews with our advanced AI technology.",
      badge: "AI Powered",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      description: "Get notified immediately when new reviews are posted via email, SMS, or WhatsApp.",
      badge: "Real-time",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Reputation Protection",
      description: "Proactively manage your online reputation and respond to negative reviews quickly.",
      badge: "Protection",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "One-Click Responses",
      description: "Post AI-generated responses directly to review platforms with a single click.",
      badge: "Fast",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Invite team members, assign roles, and collaborate on review management.",
      badge: "Team",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track your review trends, response times, and reputation score over time.",
      badge: "Analytics",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Manage your reviews on the go with our mobile app for iOS and Android.",
      badge: "Mobile",
      color: "from-gray-500 to-slate-500"
    }
  ]

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              manage reviews
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powerful tools designed to help local businesses monitor, respond to, 
            and improve their online reputation effortlessly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card hover className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing Section
const Pricing = () => {
  const features = [
    "Monitor up to 3 locations",
    "AI-powered response generation",
    "Email & WhatsApp alerts",
    "CSV export functionality",
    "Priority customer support",
    "Mobile app access",
    "Review analytics dashboard",
    "Team collaboration tools"
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start your free trial today. No hidden fees, no long-term contracts. 
            Cancel anytime.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="w-full max-w-md border-2 border-cyan-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-cyan-500/20">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <Badge variant="default" className="text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-white mb-2">Pro Plan</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">$39.99</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <CardDescription className="text-gray-300 mt-4">
                  Perfect for growing businesses that want to stay on top of their reputation
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-700">
                  <CheckoutButton size="lg" className="w-full group">
                    Start Free Trial
                    <span className="ml-2 text-sm opacity-90">7 days free</span>
                  </CheckoutButton>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    No charge today. We'll remind you 24h before trial ends.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-xl -z-10" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            Need more locations or features? Contact us for custom enterprise plans.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              7-day free trial
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2" />
              No setup fees
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Cancel anytime
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "Start with a 7-day free trial with full access to all Pro features. No credit card required. We'll send you a reminder 24 hours before your trial ends, and you can cancel anytime without any charges."
    },
    {
      question: "What platforms do you support?",
      answer: "We support Google My Business, Yelp, Facebook, and TripAdvisor. We're constantly adding new platforms based on user feedback and demand."
    },
    {
      question: "How accurate are the AI responses?",
      answer: "Our AI is trained on thousands of successful review responses and can generate contextually appropriate replies. You can always edit or customize the responses before posting."
    },
    {
      question: "Can I manage multiple business locations?",
      answer: "Yes! The Pro plan includes support for up to 3 locations. For more locations, contact us about our enterprise plans."
    },
    {
      question: "How quickly do I get notified of new reviews?",
      answer: "You'll receive instant notifications via email, SMS, or WhatsApp as soon as a new review is posted on any of your connected platforms."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is never shared with third parties."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about ReviewPilot
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-800 rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Section
const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-lg">✈️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">ReviewPilot</h3>
              <p className="text-gray-400 text-sm">Reputation Management</p>
            </div>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            The complete solution for managing your business reviews and reputation. 
            Never miss a review again.
          </p>
          <Button variant="outline" size="sm" className="group">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Product */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-semibold mb-6">Product</h4>
          <ul className="space-y-3">
            {["Features", "Pricing", "Integrations", "API", "Mobile App", "Changelog"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-3">
            {["About Us", "Careers", "Blog", "Press", "Partners", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-3 mb-6">
            {["Help Center", "Documentation", "Status", "Security", "Privacy Policy", "Terms of Service"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-400">
              <Mail className="h-4 w-4" />
              <span className="text-sm">support@reviewpilot.com</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="border-t border-gray-800 mt-12 pt-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2024 ReviewPilot. All rights reserved.
            </p>
            <Badge variant="secondary" className="text-xs">
              SOC 2 Compliant
            </Badge>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  </footer>
)

// Main App Component
function App() {
  // Simple routing based on URL path
  const currentPath = window.location.pathname;
  
  if (currentPath === '/onboarding/success') {
    return <SuccessPage />;
  }
  
  if (currentPath === '/onboarding/connect') {
    return <OnboardingConnect />;
  }
  
  if (currentPath === '/onboarding/location') {
    return <OnboardingLocation />;
  }
  
  if (currentPath === '/onboarding/alerts') {
    return <OnboardingAlerts />;
  }
  
  if (currentPath === '/oauth/callback') {
    return <OAuthCallback />;
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
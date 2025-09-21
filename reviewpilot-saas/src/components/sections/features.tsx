"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Bot, 
  Bell, 
  Shield, 
  Zap, 
  Users,
  TrendingUp,
  Smartphone
} from "lucide-react"

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

export function Features() {
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
              <Card className="h-full hover:border-gray-700 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
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

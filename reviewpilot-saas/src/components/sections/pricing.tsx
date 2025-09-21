"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckoutButton } from "@/components/checkout-button"
import { Check, Star, Zap, Building, Crown } from "lucide-react"

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Try ReviewPilot risk-free",
    icon: Zap,
    popular: false,
    features: [
      "Monitor 1 location",
      "AI response generation",
      "Email alerts",
      "Basic dashboard",
      "Community support"
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const
  },
  {
    name: "Starter",
    price: "$19.99",
    period: "per month",
    description: "Perfect for small businesses",
    icon: Star,
    popular: false,
    features: [
      "Monitor up to 2 locations",
      "AI response generation",
      "Email & SMS alerts",
      "CSV export",
      "Priority support",
      "Mobile app access"
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const
  },
  {
    name: "Pro",
    price: "$39.99",
    period: "per month",
    description: "Most popular for growing businesses",
    icon: Crown,
    popular: true,
    features: [
      "Monitor up to 3 locations",
      "AI response generation",
      "Email, SMS & WhatsApp alerts",
      "CSV export functionality",
      "Priority customer support",
      "Mobile app access",
      "Review analytics dashboard",
      "Team collaboration tools"
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const
  },
  {
    name: "Agency",
    price: "$99.99",
    period: "per month",
    description: "For agencies managing multiple clients",
    icon: Building,
    popular: false,
    features: [
      "Monitor up to 10 locations",
      "AI response generation",
      "All alert types",
      "Advanced analytics",
      "White-label dashboard",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration tools",
      "Priority support"
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const
  }
]

export function Pricing() {
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
            Choose your{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              perfect plan
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start with a free trial. No hidden fees, no long-term contracts. 
            Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`h-full ${
                plan.popular 
                  ? "border-2 border-cyan-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-cyan-500/20" 
                  : "border-gray-700 bg-gray-800/50"
              }`}>
                <CardHeader className="text-center pb-6">
                  {plan.popular && (
                    <div className="flex justify-center mb-4">
                      <Badge variant="default" className="text-sm">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.popular 
                        ? "bg-gradient-to-r from-cyan-500 to-green-500" 
                        : "bg-gray-700"
                    }`}>
                      <plan.icon className={`h-6 w-6 ${plan.popular ? "text-black" : "text-gray-300"}`} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-white mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1 text-sm">{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-300 mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: featureIndex * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    {plan.name === "Pro" ? (
                      <CheckoutButton 
                        size="lg" 
                        variant={plan.ctaVariant}
                        className="w-full group"
                      >
                        {plan.cta}
                        <span className="ml-2 text-sm opacity-90">7 days free</span>
                      </CheckoutButton>
                    ) : (
                      <Button 
                        size="lg" 
                        variant={plan.ctaVariant}
                        className="w-full group"
                        onClick={() => {
                          if (plan.name === "Agency") {
                            // Contact sales action
                            alert("Contact sales for Agency plan")
                          } else {
                            window.location.href = '/onboarding'
                          }
                        }}
                      >
                        {plan.cta}
                        {plan.name === "Free Trial" && (
                          <span className="ml-2 text-sm opacity-90">7 days free</span>
                        )}
                      </Button>
                    )}
                    
                    {plan.name === "Pro" && (
                      <p className="text-center text-sm text-gray-400 mt-3">
                        No charge today. We'll remind you 24h before trial ends.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Glow Effect for Popular Plan */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-green-500/20 blur-xl -z-10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            All plans include 7-day free trial. Need more locations or custom features? 
            <a href="#" className="text-cyan-400 hover:text-cyan-300 underline ml-1">
              Contact us for enterprise plans
            </a>
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
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
              No long-term contracts
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
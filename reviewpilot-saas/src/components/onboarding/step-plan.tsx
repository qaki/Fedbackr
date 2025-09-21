"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Shield, Clock } from "lucide-react"

interface StepPlanProps {
  onNext: () => void
  onPrev: () => void
}

export function StepPlan({ onNext, onPrev }: StepPlanProps) {
  const [isStartingTrial, setIsStartingTrial] = useState(false)

  const handleStartTrial = async () => {
    setIsStartingTrial(true)
    
    // Simulate trial start process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsStartingTrial(false)
    onNext()
  }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">
          Start with our Pro plan and get 7 days free
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl shadow-cyan-500/20">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <Badge variant="default" className="text-sm">
                <Shield className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardTitle className="text-2xl text-white mb-2">Pro Plan</CardTitle>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-white">$39.99</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <CardDescription className="text-gray-300 mt-4">
              Perfect for growing businesses that want to stay on top of their reputation
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-700">
              <Button
                size="lg"
                className="w-full group"
                onClick={handleStartTrial}
                loading={isStartingTrial}
                disabled={isStartingTrial}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {isStartingTrial ? "Starting Trial..." : "Start 7-day Free Trial"}
              </Button>
              
              <div className="mt-4 space-y-2 text-center">
                <p className="text-sm text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  No charge today. We'll remind you 24h before trial ends.
                </p>
                <p className="text-xs text-gray-500">
                  Cancel anytime. No long-term contracts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trial Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-black" />
            </div>
            <p className="text-gray-300 text-sm font-medium">7 Days Free</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <p className="text-gray-300 text-sm font-medium">No Setup Fees</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-black" />
            </div>
            <p className="text-gray-300 text-sm font-medium">Cancel Anytime</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <div className="text-sm text-gray-400 text-center">
          <p>Need more locations?</p>
          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
            Contact us for enterprise plans
          </a>
        </div>
      </div>
    </motion.div>
  )
}

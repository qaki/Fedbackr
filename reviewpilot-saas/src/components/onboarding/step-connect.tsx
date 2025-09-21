"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, AlertCircle } from "lucide-react"

interface StepConnectProps {
  onNext: () => void
  onPrev: () => void
}

export function StepConnect({ onNext, onPrev }: StepConnectProps) {
  const [connections, setConnections] = useState({
    google: false,
    yelp: false,
  })
  const [isConnecting, setIsConnecting] = useState<string | null>(null)

  const handleConnect = async (platform: string) => {
    setIsConnecting(platform)
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setConnections(prev => ({ ...prev, [platform]: true }))
    setIsConnecting(null)
  }

  const canProceed = connections.google || connections.yelp

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Business</h2>
        <p className="text-gray-400">
          Link your business accounts to start monitoring reviews
        </p>
      </div>

      <div className="space-y-6">
        {/* Google My Business */}
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Google My Business</h3>
                <p className="text-gray-400 text-sm">Connect your Google Business profile</p>
              </div>
            </div>
            {connections.google ? (
              <Badge variant="success" className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Connected</span>
              </Badge>
            ) : (
              <Badge variant="outline">Not Connected</Badge>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-2">
              Connect to monitor reviews from Google My Business and respond to them directly.
            </p>
            <div className="flex items-center text-cyan-400 text-sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              <span>Secure OAuth connection</span>
            </div>
          </div>

          <Button
            onClick={() => handleConnect("google")}
            disabled={connections.google || isConnecting === "google"}
            loading={isConnecting === "google"}
            variant={connections.google ? "secondary" : "default"}
            className="w-full"
          >
            {connections.google ? "Connected" : "Connect Google Business"}
          </Button>
        </div>

        {/* Yelp */}
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Yelp</h3>
                <p className="text-gray-400 text-sm">Connect your Yelp business page</p>
              </div>
            </div>
            {connections.yelp ? (
              <Badge variant="success" className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Connected</span>
              </Badge>
            ) : (
              <Badge variant="outline">Not Connected</Badge>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-2">
              Connect to monitor reviews from Yelp and manage your business reputation.
            </p>
            <div className="flex items-center text-cyan-400 text-sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              <span>Secure API connection</span>
            </div>
          </div>

          <Button
            onClick={() => handleConnect("yelp")}
            disabled={connections.yelp || isConnecting === "yelp"}
            loading={isConnecting === "yelp"}
            variant={connections.yelp ? "secondary" : "default"}
            className="w-full"
          >
            {connections.yelp ? "Connected" : "Connect Yelp"}
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-semibold text-sm mb-1">
                Don't worry if you can't connect now
              </h4>
              <p className="text-blue-300 text-sm">
                You can connect your business accounts later from your dashboard. 
                You only need to connect at least one platform to get started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="group"
        >
          Continue
          <span className="ml-2 text-sm opacity-90">
            {connections.google && connections.yelp ? "Both connected" : "1 connected"}
          </span>
        </Button>
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
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
              <Button 
                size="xl" 
                className="group"
                onClick={() => window.location.href = '/onboarding'}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="group"
                onClick={() => window.location.href = '/app'}
              >
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
}

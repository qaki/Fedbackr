"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { StepAccount } from "./step-account"
import { StepConnect } from "./step-connect"
import { StepPlan } from "./step-plan"
import { CheckCircle } from "lucide-react"

const steps = [
  { id: 1, title: "Account", description: "Create your account" },
  { id: 2, title: "Connect", description: "Link your business accounts" },
  { id: 3, title: "Plan", description: "Choose your plan" },
]

export function Wizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-black" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to ReviewPilot!
            </h2>
            <p className="text-gray-300 mb-6">
              Your account has been created successfully. You can now start your free trial.
            </p>
            
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => window.location.href = '/app'}
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.id
                      ? "bg-cyan-500 text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step.id ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            {steps.map((step) => (
              <span key={step.id}>{step.title}</span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepAccount onNext={nextStep} />
            )}
            {currentStep === 2 && (
              <StepConnect onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 3 && (
              <StepPlan onNext={nextStep} onPrev={prevStep} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

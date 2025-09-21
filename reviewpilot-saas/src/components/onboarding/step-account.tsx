"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface StepAccountProps {
  onNext: () => void
}

export function StepAccount({ onNext }: StepAccountProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    onNext()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
        <p className="text-gray-400">
          Let's get you started with ReviewPilot
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-400 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-300">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500" : ""}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-red-400 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-300">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? "border-red-500" : ""}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="text-red-400 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
            className={errors.agreeToTerms ? "border-red-500" : ""}
          />
          <div className="flex-1">
            <Label htmlFor="agreeToTerms" className="text-gray-300 text-sm leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                Privacy Policy
              </a>
            </Label>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm mt-1">
                {errors.agreeToTerms}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </motion.div>
  )
}

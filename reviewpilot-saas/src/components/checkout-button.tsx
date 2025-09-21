"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CheckoutButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
}

export function CheckoutButton({ 
  children, 
  className = "", 
  variant = "default",
  size = "lg" 
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ls/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout')
      }

      // Redirect to Lemon Squeezy checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      variant={variant}
      size={size === "md" ? "default" : size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Checkout...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

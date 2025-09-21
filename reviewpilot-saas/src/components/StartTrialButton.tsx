"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StartTrialButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function StartTrialButton({ className, children }: StartTrialButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    
    try {
      const res = await fetch("/api/ls/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout");
      }

      const data = await res.json();
      
      if (data.url) {
        // Redirect to Lemon Squeezy checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start trial. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartTrial}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Starting Trial...
        </>
      ) : (
        children || "Start Free Trial"
      )}
    </Button>
  );
}

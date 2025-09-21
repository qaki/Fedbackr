"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CompleteSetupButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function CompleteSetupButton({ className, children }: CompleteSetupButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCompleteSetup = async () => {
    setLoading(true);
    
    try {
      const res = await fetch("/api/onboarding/next");
      
      if (!res.ok) {
        throw new Error("Failed to get next step");
      }

      const data = await res.json();
      
      if (data.next) {
        // Redirect to the next onboarding step
        window.location.href = data.next;
      } else {
        // Fallback to app if no next step
        window.location.href = "/app";
      }
    } catch (error) {
      console.error("Onboarding next error:", error);
      // Fallback to app on error
      window.location.href = "/app";
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCompleteSetup}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children || "Complete Setup"
      )}
    </Button>
  );
}

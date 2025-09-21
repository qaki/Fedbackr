import React, { useState } from 'react';

const CheckoutButton = ({ children, className = '', variant = 'primary', size = 'lg', onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, redirect to a success page
      // In production, this would call the actual Lemon Squeezy API
      window.location.href = '/onboarding/success?checkout=success';
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = "font-medium rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 focus:ring-cyan-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 focus:ring-gray-500",
    outline: "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black focus:ring-cyan-500",
    ghost: "hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-lg font-semibold",
    xl: "px-10 py-4 text-lg font-semibold",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading && (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default CheckoutButton;

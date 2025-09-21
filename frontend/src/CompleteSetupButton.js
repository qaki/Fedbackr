import React, { useState } from 'react';
import { getNextOnboardingPath, getOnboardingProgress } from './onboarding';

const CompleteSetupButton = ({ className = '', variant = 'outline', size = 'sm' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const progress = getOnboardingProgress();

  const handleCompleteSetup = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the next onboarding step
      const nextPath = getNextOnboardingPath();
      
      // Redirect to the next step
      window.location.href = nextPath;
      
    } catch (error) {
      console.error('Error getting next onboarding step:', error);
      alert('Failed to get next step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    
    if (!progress.hasConnectedGoogle) {
      return 'Connect Google Business';
    }
    
    if (!progress.hasSelectedLocation) {
      return 'Select Location';
    }
    
    if (!progress.hasSetAlerts) {
      return 'Set Up Alerts';
    }
    
    return 'Go to Dashboard';
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }
    
    if (!progress.hasConnectedGoogle) {
      return <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    }
    
    if (!progress.hasSelectedLocation) {
      return <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    }
    
    if (!progress.hasSetAlerts) {
      return <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7M4.828 17l2.586-2.586a2 2 0 012.828 0L12.828 17" /></svg>;
    }
    
    return <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  };

  const baseClasses = "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 focus:ring-cyan-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 focus:ring-gray-500",
    outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500",
    ghost: "hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg font-semibold",
    xl: "px-8 py-4 text-lg font-semibold",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleCompleteSetup}
      disabled={isLoading}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
};

export default CompleteSetupButton;

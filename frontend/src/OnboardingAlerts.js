import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Bell, Mail, Smartphone } from 'lucide-react';
import { getOnboardingProgress, markOnboardingStepComplete, ONBOARDING_STEPS } from './onboarding';

const OnboardingAlerts = () => {
  const [alertSettings, setAlertSettings] = useState({
    email: true,
    sms: false,
    whatsapp: false,
    newReviews: true,
    negativeReviews: true,
    ratingThreshold: 3
  });
  const [isSaving, setIsSaving] = useState(false);

  const progress = getOnboardingProgress();

  // Check prerequisites
  if (!progress.hasConnectedGoogle || !progress.hasSelectedLocation) {
    window.location.href = '/onboarding/connect';
    return null;
  }

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save alert settings
      localStorage.setItem('alert_settings', JSON.stringify(alertSettings));
      
      // Mark step as complete
      markOnboardingStepComplete(ONBOARDING_STEPS.SET_ALERTS);
      
      // Redirect to dashboard
      window.location.href = '/app';
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    // Mark as complete with default settings
    markOnboardingStepComplete(ONBOARDING_STEPS.SET_ALERTS);
    window.location.href = '/app';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.location.href = '/onboarding/location'}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Location
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Review Alerts</h1>
          <p className="text-gray-400">
            Choose how you want to be notified when new reviews are posted.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className="text-green-400">Connect Google</span>
            <span className="text-green-400">Select Location</span>
            <span className="text-cyan-400">Set Alerts</span>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="space-y-8">
          {/* Notification Methods */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Bell className="mr-3 h-5 w-5 text-cyan-400" />
              Notification Methods
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Get alerts sent to your email address</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertSettings.email}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, email: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="text-white font-medium">SMS Notifications</h3>
                    <p className="text-gray-400 text-sm">Get alerts sent to your phone number</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertSettings.sms}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, sms: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Alert Types */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Alert Types</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">New Reviews</h3>
                  <p className="text-gray-400 text-sm">Get notified when any new review is posted</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertSettings.newReviews}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, newReviews: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Negative Reviews</h3>
                  <p className="text-gray-400 text-sm">Get notified when reviews below 3 stars are posted</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertSettings.negativeReviews}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, negativeReviews: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={handleSkip}
            className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg transition-colors"
          >
            Skip for Now
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSaving ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Complete Setup
                <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
          <h3 className="text-green-400 font-semibold mb-2">Setup Almost Complete!</h3>
          <p className="text-gray-300 text-sm">
            Once you save these settings, you'll be redirected to your dashboard where you can start 
            monitoring and responding to reviews with AI assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAlerts;


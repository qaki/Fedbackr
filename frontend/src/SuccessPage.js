import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Calendar, CreditCard, Settings } from 'lucide-react';
import CompleteSetupButton from './CompleteSetupButton';
import { getOnboardingProgress } from './onboarding';

const SuccessPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isCheckoutSuccess = urlParams.get('checkout') === 'success';
  const progress = getOnboardingProgress();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-white mb-4"
          >
            {isCheckoutSuccess ? "Welcome to ReviewPilot Pro!" : "Setup Complete!"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {isCheckoutSuccess 
              ? "Your subscription is now active. Start managing your reviews with AI-powered responses."
              : "Your account is ready. Complete your setup to start managing your reviews."
            }
          </motion.p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Account Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              <h3 className="text-white text-lg font-semibold">Account</h3>
            </div>
            <p className="text-white font-semibold">Demo User</p>
            <p className="text-gray-400 text-sm">demo@reviewpilot.com</p>
            <span className="inline-flex items-center rounded-full border border-green-400 px-2.5 py-0.5 text-xs font-semibold text-green-400 mt-2">
              Active
            </span>
          </motion.div>

          {/* Organization Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              <h3 className="text-white text-lg font-semibold">Organization</h3>
            </div>
            <p className="text-white font-semibold">Demo Business</p>
            <p className="text-gray-400 text-sm">Restaurant</p>
            <span className="inline-flex items-center rounded-full border border-green-400 px-2.5 py-0.5 text-xs font-semibold text-green-400 mt-2">
              Configured
            </span>
          </motion.div>

          {/* Subscription Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6"
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              <h3 className="text-white text-lg font-semibold">Subscription</h3>
            </div>
            <p className="text-white font-semibold">
              {isCheckoutSuccess ? 'Free Trial' : 'Pro Plan'}
            </p>
            <p className="text-gray-400 text-sm">
              {isCheckoutSuccess 
                ? `Trial ends ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
                : '$39.99/month'
              }
            </p>
            <span className="inline-flex items-center rounded-full border border-green-400 px-2.5 py-0.5 text-xs font-semibold text-green-400 mt-2">
              {isCheckoutSuccess ? 'trialing' : 'active'}
            </span>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/20 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-white text-xl font-semibold mb-4">Next Steps</h2>
          <p className="text-gray-400 mb-6">
            Complete your setup to start managing your reviews effectively.
          </p>
          <div className="space-y-4">
            {/* Step 1: Connect Google Business */}
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progress.hasConnectedGoogle ? 'bg-green-500' : 'bg-cyan-500'
              }`}>
                {progress.hasConnectedGoogle ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-white text-sm font-bold">1</span>
                )}
              </div>
              <span className={progress.hasConnectedGoogle ? 'text-green-400' : 'text-white'}>
                Connect Google Business
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {progress.hasConnectedGoogle ? 'Completed' : 'Required'}
              </span>
            </div>

            {/* Step 2: Select Location */}
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progress.hasSelectedLocation ? 'bg-green-500' : 
                progress.hasConnectedGoogle ? 'bg-cyan-500' : 'bg-gray-600'
              }`}>
                {progress.hasSelectedLocation ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-white text-sm font-bold">2</span>
                )}
              </div>
              <span className={progress.hasSelectedLocation ? 'text-green-400' : 
                progress.hasConnectedGoogle ? 'text-white' : 'text-gray-400'}>
                Select your business location
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {progress.hasSelectedLocation ? 'Completed' : 
                 progress.hasConnectedGoogle ? 'Required' : 'Locked'}
              </span>
            </div>

            {/* Step 3: Set Up Alerts */}
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                progress.hasSetAlerts ? 'bg-green-500' : 
                progress.hasSelectedLocation ? 'bg-cyan-500' : 'bg-gray-600'
              }`}>
                {progress.hasSetAlerts ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-white text-sm font-bold">3</span>
                )}
              </div>
              <span className={progress.hasSetAlerts ? 'text-green-400' : 
                progress.hasSelectedLocation ? 'text-white' : 'text-gray-400'}>
                Set up review alerts
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {progress.hasSetAlerts ? 'Completed' : 
                 progress.hasSelectedLocation ? 'Required' : 'Locked'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-8 py-3 rounded-lg group transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4 inline group-hover:translate-x-1 transition-transform" />
          </button>
          
          <CompleteSetupButton 
            variant="outline"
            size="lg"
            className="px-8 py-3"
          />
        </motion.div>

        {/* Trial Information */}
        {isCheckoutSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mt-8"
          >
            <div className="flex items-center mb-4">
              <Calendar className="mr-2 h-5 w-5 text-yellow-400" />
              <h3 className="text-yellow-400 text-lg font-semibold">Free Trial Active</h3>
            </div>
            <p className="text-gray-300">
              Your 7-day free trial is now active! You have full access to all Pro features. 
              Your subscription will automatically renew on{' '}
              <span className="text-white font-semibold">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
              .
            </p>
            <p className="text-gray-400 text-sm mt-2">
              You can cancel anytime from your dashboard settings.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;

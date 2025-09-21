import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { exchangeCodeForTokens, storeGoogleTokens } from './google-oauth';
import { markOnboardingStepComplete, ONBOARDING_STEPS } from './onboarding';

const OAuthCallback = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        // Handle OAuth errors
        if (error) {
          setError(`OAuth error: ${error}`);
          setStatus('error');
          return;
        }

        // Validate required parameters
        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        // Verify state parameter (CSRF protection)
        const storedState = sessionStorage.getItem('oauth_state');
        if (!state || state !== storedState) {
          setError('Invalid state parameter');
          setStatus('error');
          return;
        }

        // Exchange code for tokens
        setStatus('processing');
        const tokens = await exchangeCodeForTokens(code);

        // Store tokens
        storeGoogleTokens(tokens);

        // Mark onboarding step as complete
        markOnboardingStepComplete(ONBOARDING_STEPS.CONNECT_GOOGLE);

        // Clear stored state
        sessionStorage.removeItem('oauth_state');

        // Set success status
        setStatus('success');

        // Redirect to next step after a short delay
        setTimeout(() => {
          window.location.href = '/onboarding/location';
        }, 2000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'Failed to complete Google connection');
        setStatus('error');
      }
    };

    handleCallback();
  }, []);

  const handleRetry = () => {
    window.location.href = '/onboarding/connect';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center"
        >
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Connecting to Google</h2>
              <p className="text-gray-400 mb-6">
                We're setting up your Google Business Profile connection...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Successfully Connected!</h2>
              <p className="text-gray-400 mb-6">
                Your Google Business Profile has been connected successfully. 
                Redirecting to the next step...
              </p>
              <div className="flex items-center justify-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Redirecting...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Connection Failed</h2>
              <p className="text-gray-400 mb-6">
                {error || 'We encountered an error while connecting your Google account.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Having trouble? Check that you have the necessary permissions for your Google Business Profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;

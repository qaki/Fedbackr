import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, MapPin, Building } from 'lucide-react';
import { getOnboardingProgress, markOnboardingStepComplete, ONBOARDING_STEPS } from './onboarding';

const OnboardingLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAttaching, setIsAttaching] = useState(false);

  const progress = getOnboardingProgress();

  // Check if Google is connected, redirect if not
  useEffect(() => {
    if (!progress.hasConnectedGoogle) {
      window.location.href = '/onboarding/connect';
      return;
    }
  }, [progress.hasConnectedGoogle]);

  // Mock Google Business locations
  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock Google Business locations
        const mockLocations = [
          {
            id: 'locations/1234567890',
            displayName: 'Downtown Coffee Shop',
            address: '123 Main Street, Downtown, NY 10001',
            phone: '(555) 123-4567',
            category: 'Coffee shop'
          },
          {
            id: 'locations/2345678901',
            displayName: 'Main Street Restaurant',
            address: '456 Oak Avenue, Midtown, NY 10002',
            phone: '(555) 234-5678',
            category: 'Restaurant'
          },
          {
            id: 'locations/3456789012',
            displayName: 'Central Plaza Store',
            address: '789 Pine Street, Uptown, NY 10003',
            phone: '(555) 345-6789',
            category: 'Retail store'
          }
        ];
        
        setLocations(mockLocations);
      } catch (err) {
        setError('Failed to load locations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleSelectLocation = async (location) => {
    setIsAttaching(true);
    setSelectedLocation(location);
    
    try {
      // Simulate API call to attach location
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark step as complete
      markOnboardingStepComplete(ONBOARDING_STEPS.SELECT_LOCATION);
      
      // Store selected location
      localStorage.setItem('selected_location', JSON.stringify(location));
      
      // Redirect to next step
      window.location.href = '/onboarding/alerts';
      
    } catch (error) {
      console.error('Error selecting location:', error);
      alert('Failed to select location. Please try again.');
    } finally {
      setIsAttaching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading your locations...</h2>
          <p className="text-gray-400">Fetching your Google Business Profile locations</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Locations</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => window.location.href = '/onboarding/connect'}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Connect
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Select Your Business Location</h1>
          <p className="text-gray-400">
            Choose the Google Business Profile location you want to manage reviews for.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 h-1 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">2</span>
            </div>
            <div className="flex-1 h-1 bg-gray-700 rounded">
              <div className="h-1 bg-cyan-500 rounded w-1/3"></div>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-sm font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className="text-green-400">Connect Google</span>
            <span className="text-cyan-400">Select Location</span>
            <span>Set Alerts</span>
          </div>
        </div>

        {/* Locations List */}
        {locations.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Locations Found</h3>
            <p className="text-gray-400 mb-4">
              We couldn't find any Google Business Profile locations for your account.
            </p>
            <p className="text-gray-500 text-sm">
              Make sure your Google account has manager or owner access to a Business Profile.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6">
              Choose from {locations.length} location{locations.length !== 1 ? 's' : ''}:
            </h2>
            
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{location.displayName}</h3>
                        <p className="text-cyan-400 text-sm">{location.category}</p>
                      </div>
                    </div>
                    
                    <div className="ml-13 space-y-2">
                      <p className="text-gray-300">{location.address}</p>
                      <p className="text-gray-400 text-sm">{location.phone}</p>
                      <p className="text-gray-500 text-xs font-mono">{location.id}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSelectLocation(location)}
                    disabled={isAttaching}
                    className={`ml-6 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isAttaching && selectedLocation?.id === location.id
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                    }`}
                  >
                    {isAttaching && selectedLocation?.id === location.id ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Selecting...
                      </>
                    ) : (
                      'Select'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-blue-400 font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-300 text-sm">
            If you don't see your business location, make sure you have manager or owner access 
            to the Google Business Profile. You can request access from the current owner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLocation;


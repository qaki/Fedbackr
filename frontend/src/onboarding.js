// Onboarding state management for React app
// In production, this would be handled by the backend API

export const ONBOARDING_STEPS = {
  CONNECT_GOOGLE: 'connect',
  SELECT_LOCATION: 'location', 
  SET_ALERTS: 'alerts',
  COMPLETE: 'app'
};

export const getOnboardingProgress = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    hasConnectedGoogle: localStorage.getItem('onboarding_google') === 'true',
    hasSelectedLocation: localStorage.getItem('onboarding_location') === 'true',
    hasSetAlerts: localStorage.getItem('onboarding_alerts') === 'true'
  };
};

export const getNextOnboardingPath = () => {
  const progress = getOnboardingProgress();
  
  if (!progress.hasConnectedGoogle) {
    return '/onboarding/connect';
  }
  
  if (!progress.hasSelectedLocation) {
    return '/onboarding/location';
  }
  
  if (!progress.hasSetAlerts) {
    return '/onboarding/alerts';
  }
  
  return '/app';
};

export const markOnboardingStepComplete = (step) => {
  if (typeof window === 'undefined') return;
  
  switch (step) {
    case ONBOARDING_STEPS.CONNECT_GOOGLE:
      localStorage.setItem('onboarding_google', 'true');
      break;
    case ONBOARDING_STEPS.SELECT_LOCATION:
      localStorage.setItem('onboarding_location', 'true');
      break;
    case ONBOARDING_STEPS.SET_ALERTS:
      localStorage.setItem('onboarding_alerts', 'true');
      break;
  }
};

export const resetOnboardingProgress = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('onboarding_google');
  localStorage.removeItem('onboarding_location');
  localStorage.removeItem('onboarding_alerts');
};

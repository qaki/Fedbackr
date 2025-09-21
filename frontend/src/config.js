// Configuration for Google OAuth and other settings
// In production, these should be set via environment variables

export const config = {
  // Google OAuth Configuration
  // Get these from Google Cloud Console: https://console.cloud.google.com/
  google: {
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
    clientSecret: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_SECRET || 'your-google-client-secret',
  },
  
  // App Configuration
  app: {
    url: process.env.REACT_APP_APP_URL || 'http://localhost:3000',
  },
  
  // OAuth Scopes
  scopes: [
    'openid',
    'email', 
    'profile',
    'https://www.googleapis.com/auth/business.manage',
  ],
};

// Helper function to get Google OAuth client ID
export const getGoogleClientId = () => {
  return config.google.clientId;
};

// Helper function to get Google OAuth client secret
export const getGoogleClientSecret = () => {
  return config.google.clientSecret;
};

// Helper function to get app URL
export const getAppUrl = () => {
  return config.app.url;
};

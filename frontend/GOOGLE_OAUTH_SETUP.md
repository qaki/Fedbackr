# Google OAuth Setup Instructions

This guide will help you set up Google OAuth for the ReviewPilot application to connect with Google Business Profile.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- A Google Business Profile (optional, for testing)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "ReviewPilot"
4. Click "Create"

## Step 2: Enable Google Business Profile API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Business Profile API"
3. Click on "Google Business Profile API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "ReviewPilot"
     - User support email: your email
     - Developer contact: your email
   - Add scopes:
     - `https://www.googleapis.com/auth/business.manage`
     - `openid`
     - `email`
     - `profile`
   - Add test users (your email)

4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "ReviewPilot Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/oauth/callback`
     - `https://yourdomain.com/oauth/callback` (for production)

5. Click "Create"
6. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
REACT_APP_GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# App Configuration
REACT_APP_APP_URL=http://localhost:3000
```

## Step 5: Update Configuration

If you prefer to hardcode the values (for development only), update `frontend/src/config.js`:

```javascript
export const config = {
  google: {
    clientId: 'your-client-id.apps.googleusercontent.com',
    clientSecret: 'your-client-secret',
  },
  app: {
    url: 'http://localhost:3000',
  },
  // ... rest of config
};
```

## Step 6: Test the Integration

1. Start the React app: `npm start`
2. Go to `http://localhost:3000`
3. Click "Start Free Trial"
4. Click "Complete Setup"
5. Click "Connect Google Business"
6. You should be redirected to Google's OAuth consent screen
7. After authorization, you'll be redirected back to the app

## Troubleshooting

### Common Issues

1. **"Invalid client" error**
   - Check that your Client ID is correct
   - Ensure the redirect URI matches exactly

2. **"Access blocked" error**
   - Make sure your app is in "Testing" mode
   - Add your email as a test user
   - For production, submit for verification

3. **"Scope not authorized" error**
   - Ensure the Business Profile API is enabled
   - Check that the required scopes are added to the OAuth consent screen

4. **CORS errors**
   - Make sure `http://localhost:3000` is in authorized JavaScript origins
   - Check that the redirect URI is in authorized redirect URIs

### Testing with Google Business Profile

To test with a real Google Business Profile:

1. Make sure you have a Google Business Profile
2. Ensure you have manager or owner access
3. The OAuth flow will request permission to manage your business profile
4. After connection, you should see your business locations in the location selection step

## Production Deployment

For production deployment:

1. Update the OAuth consent screen to "Production"
2. Add your production domain to authorized origins and redirect URIs
3. Submit for Google verification (required for sensitive scopes)
4. Update environment variables with production values

## Security Notes

- Never commit `.env` files to version control
- Use environment variables in production
- The client secret should be kept secure
- Consider using a backend proxy for token exchange in production

## API Limits

- Google Business Profile API has rate limits
- Monitor your usage in the Google Cloud Console
- Implement proper error handling and retry logic

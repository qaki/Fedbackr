// Google OAuth helper functions for Business Profile integration
import { config } from './config';

export const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/**
 * Scopes for Business Profile (locations + replies). Keep minimal to reduce review friction.
 * - https://www.googleapis.com/auth/business.manage
 * - openid email profile (optional convenience)
 */
export const GBP_SCOPES = config.scopes.join(" ");

/**
 * Build Google OAuth URL with proper scopes and offline access
 */
export function buildGoogleAuthUrl(state) {
  const clientId = config.google.clientId;
  const redirectUri = `${config.app.url}/oauth/callback`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GBP_SCOPES,
    access_type: "offline",     // get refresh_token
    prompt: "consent",          // force refresh_token on repeat connects
    include_granted_scopes: "true",
    state,
  });
  
  return `${GOOGLE_AUTH_BASE}?${params.toString()}`;
}

/**
 * Exchange authorization code for access and refresh tokens
 */
export async function exchangeCodeForTokens(code) {
  const clientId = config.google.clientId;
  const clientSecret = config.google.clientSecret;
  const redirectUri = `${config.app.url}/oauth/callback`;

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Token exchange error:', error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken) {
  const clientId = config.google.clientId;
  const clientSecret = config.google.clientSecret;
  
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  
  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Refresh failed: ${errorText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

/**
 * Generate a random state string for CSRF protection
 */
export function generateState() {
  const randomBytes = new Array(24).fill(0).map(() => Math.floor(Math.random() * 256));
  return randomBytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Store Google tokens in localStorage (for demo purposes)
 * In production, these should be stored securely on the server
 */
export function storeGoogleTokens(tokens) {
  const tokenData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
    scope: tokens.scope,
    token_type: tokens.token_type,
    expiry_date: Date.now() + (tokens.expires_in * 1000)
  };
  
  localStorage.setItem('google_tokens', JSON.stringify(tokenData));
  localStorage.setItem('google_connected', 'true');
}

/**
 * Get stored Google tokens
 */
export function getGoogleTokens() {
  const stored = localStorage.getItem('google_tokens');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing stored tokens:', error);
    return null;
  }
}

/**
 * Check if Google is connected
 */
export function isGoogleConnected() {
  return localStorage.getItem('google_connected') === 'true';
}

/**
 * Clear Google tokens (for disconnect)
 */
export function clearGoogleTokens() {
  localStorage.removeItem('google_tokens');
  localStorage.removeItem('google_connected');
}

/**
 * Check if access token is expired or expires soon
 */
export function isTokenExpired(tokens) {
  if (!tokens || !tokens.expiry_date) return true;
  
  // Consider expired if expires within 2 minutes
  const buffer = 2 * 60 * 1000; // 2 minutes in milliseconds
  return Date.now() + buffer >= tokens.expiry_date;
}

/**
 * Get valid access token, refreshing if necessary
 */
export async function getValidAccessToken() {
  const tokens = getGoogleTokens();
  
  if (!tokens) return null;
  
  if (isTokenExpired(tokens) && tokens.refresh_token) {
    try {
      const refreshed = await refreshAccessToken(tokens.refresh_token);
      const newTokens = {
        ...tokens,
        access_token: refreshed.access_token,
        expires_in: refreshed.expires_in,
        expiry_date: Date.now() + (refreshed.expires_in * 1000)
      };
      
      storeGoogleTokens(newTokens);
      return refreshed.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Return old token, let the API call fail if it's truly expired
      return tokens.access_token;
    }
  }
  
  return tokens.access_token;
}

import api from './api';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (momentListener?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: GoogleTokenResponse) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
          initCodeClient: (config: any) => any;
          hasGrantedAllScopes: (token: any, ...scopes: string[]) => boolean;
        };
      };
    };
  }
}

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * Loads the Google Identity Services script if not already on page
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();

    if (window.google?.accounts?.oauth2) {
      return resolve();
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/**
 * Initiates the Google OAuth 2.0 Account Chooser popup
 * Returns the access token from Google
 */
export const requestGoogleAccessToken = async (): Promise<string> => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId || clientId.trim() === '') {
    throw new Error(
      'Google sign-in is not configured yet. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your frontend/.env file.'
    );
  }

  await loadGoogleScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services SDK failed to initialize.');
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'openid email profile',
        callback: (response: GoogleTokenResponse) => {
          if (response.error) {
            if (response.error === 'popup_closed_by_user' || response.error === 'access_denied') {
              reject(new Error('POPUP_CLOSED'));
            } else {
              reject(new Error(response.error_description || response.error || 'Google authentication failed.'));
            }
            return;
          }

          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token returned by Google.'));
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || 'Google OAuth client error'));
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(err);
    }
  });
};

/**
 * Real-Time Google Sign-In / Sign-Up
 * 1. Opens Google Account Chooser popup
 * 2. Gets access token from Google
 * 3. Backend verifies token with Google API & returns JWT + user profile
 */
export const authenticateWithGoogle = async () => {
  const accessToken = await requestGoogleAccessToken();

  const { data } = await api.post('/auth/google', {
    accessToken,
  });

  if (!data?.success || !data?.token) {
    throw new Error(data?.message || 'Server authentication with Google failed.');
  }

  return {
    user: data.user,
    token: data.token,
  };
};

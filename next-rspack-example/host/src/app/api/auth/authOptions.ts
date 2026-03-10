import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

const COOKIES_LIFE_TIME = 900;
const IS_LOCALHOST = process.env.NEXTAUTH_URL?.includes('localhost');
const SECURE_COOKIE_PREFIX = IS_LOCALHOST ? '' : '__Secure-';
const USE_SECURE_COOKIES = !IS_LOCALHOST;

export const authOptions: NextAuthOptions = {
  pages: {
    signOut: '/signout',
    signIn: '/',
  },

  providers: [
    AzureADProvider({
      clientId: process.env.NEXT_CLIENT_ID!,
      clientSecret: process.env.NEXT_CLIENT_SECRET!,
      tenantId: process.env.NEXT_TENANT_ID!,
      authorization: {
        params: {
          scope: 'openid profile email offline_access https://graph.microsoft.com/.default',
        },
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      // baseUrl already includes the basePath (/omb/dispatcher/ui)
      // so just return it for the default redirect
      if (url === baseUrl) {
        return baseUrl;
      }

      return url;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        const expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000; // Default to 1 hour if expires_at is not provided
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = expiresAt;
        return token;
      }

      const bufferTime = 5 * 60 * 1000; // 5 minute
      if (Date.now() < (token.accessTokenExpires as number) - bufferTime) {
        return token;
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.access_token = token.accessToken as string;
      session.error = token.error as string;
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.session-token`,
      options: {
        path: '/omb',
        httpOnly: true,
        sameSite: 'lax',
        secure: USE_SECURE_COOKIES,
      },
    },
    callbackUrl: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.callback-url`,
      options: {
        path: '/omb',
        sameSite: 'lax',
        secure: USE_SECURE_COOKIES,
      },
    },
    csrfToken: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/omb',
        secure: USE_SECURE_COOKIES,
      },
    },
    state: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/omb',
        secure: USE_SECURE_COOKIES,
        maxAge: COOKIES_LIFE_TIME,
      },
    },
    pkceCodeVerifier: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/omb',
        secure: USE_SECURE_COOKIES,
        maxAge: COOKIES_LIFE_TIME,
      },
    },
    nonce: {
      name: `${SECURE_COOKIE_PREFIX}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/omb',
        secure: USE_SECURE_COOKIES,
      },
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const refreshAccessToken = async (token: any) => {
  try {
    const url = `https://login.microsoftonline.com/${process.env.NEXT_TENANT_ID}/oauth2/v2.0/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_CLIENT_ID!,
        client_secret: process.env.NEXT_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
        scope: 'openid profile email offline_access https://graph.microsoft.com/.default',
      }),
    });
    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }
    const expiresAt = refreshedTokens.expires_in ? refreshedTokens.expires_in * 1000 : Date.now() + 3600 * 1000; // Default to 1 hour if expires_at is not provided
    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: expiresAt,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Failed to refresh access token:', error as Error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

import type { NextConfig } from "next";
import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const BASE_PATH = '';

const nextConfig: NextConfig = {
  /* config options here */
  basePath: BASE_PATH,
  async headers() {
    return [
      {
        // Allow any origin to call auth APIs (GET/POST session, CSRF, signIn, signOut)
        // Note: credentials (cookies) cannot be sent when origin is *.
        // If session cookies are needed cross-origin, replace * with the specific origin
        // and add Access-Control-Allow-Credentials: true in middleware.ts instead.
        source: BASE_PATH + '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-CSRF-Token' },
        ],
      },
    ];
  },

  webpack: (config, { isServer, nextRuntime }) => {
    // publicPath "auto" is not supported in the Edge Runtime (used by middleware)
    if (nextRuntime !== 'edge') {
      config.output.publicPath = "auto";
    }
    if (!isServer) config.plugins.push(new NextFederationPlugin({
      name: 'host_app',
      remotes: {
        dtec_app1: 'dtec_app1@http://localhost:3001/_next/static/chunks/remoteEntry.js',
      },
      exposes: {
        './LayoutProvider': './pages/LayoutProvider.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
          eager: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
          eager: false,
        },
      },
      filename: 'static/chunks/remoteEntry.js',
      extraOptions: {
        exposePages: true,
      },
    }));

    return config;
  },
};

export default nextConfig;

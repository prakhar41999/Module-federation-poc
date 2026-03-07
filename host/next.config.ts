import withRspack from 'next-rspack';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import mfConfig from './module-federation.config';
import type { NextConfig } from "next";

const BASE_PATH = '/omb/dispatcher/ui';

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  async headers() {
    return [
      {
        // Allow omb-admin-fe (localhost:3000) to fetch the MF manifest,
        // remoteEntry, and all MF lazy chunks from this host.
        // /_next/mf-manifest.json and /_next/static/** are both needed.
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },

    ];
  },
  webpack: (config, { isServer }) => {
    // #region agent log
    console.log('[MF-DEBUG][next.config] webpack callback - isServer:', isServer, '| applying MF:', !isServer);
    fetch('http://127.0.0.1:7864/ingest/ab7286ab-46b1-4a39-81da-35546388e6d9', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '69016a' }, body: JSON.stringify({ sessionId: '69016a', location: 'next.config.ts:webpack', message: 'MF plugin decision', data: { isServer, applyingMF: !isServer }, timestamp: Date.now(), hypothesisId: 'G', runId: 'run3' }) }).catch(() => { });
    // #endregion
    if (!isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(new ModuleFederationPlugin(mfConfig));
    }

    return config;
  },
};

export default withRspack(nextConfig);

import withRspack from 'next-rspack';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import type { NextConfig } from "next";
import path from 'path';

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
  webpack: (config) => {
    config.plugins.push(new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        dtec_app1: 'dtec_app1@http://localhost:3001/_next/static/chunks/remoteEntry.js',
      },
      runtimePlugins: [path.resolve(__dirname, './module-federation.config.ts')],
    }));

    return config;
  },
};

export default withRspack(nextConfig);

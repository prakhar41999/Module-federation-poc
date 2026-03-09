import type { NextConfig } from "next";
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import withRspack from 'next-rspack';
import mfConfig from './module-federation.config';

const BASE_PATH = '';

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
    turbopack: {},
    webpack: (config) => {
        config.plugins.push(new ModuleFederationPlugin(mfConfig));
        return config;
    },
};

export default withRspack(nextConfig);

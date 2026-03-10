import NextFederationPlugin from "@module-federation/nextjs-mf";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime !== 'edge') {
      config.output.publicPath = "auto";
    }
    config.output = config.output || {};
    config.output.uniqueName = 'dtec_app1';
    config.plugins.push(new NextFederationPlugin({
      name: 'dtec-app1',
      remotes: {
        host_app: 'host_app@http://localhost:3000/_next/static/chunks/remoteEntry.js',
      },
      exposes: {},
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

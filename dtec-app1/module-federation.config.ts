import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
    name: 'dtec_app1',
    dts: {
        generateTypes: false,
        consumeTypes: false,
    },
    filename: 'static/chunks/remoteEntry.js',
    exposes: {
        './app': './app/page.tsx',
    }
});

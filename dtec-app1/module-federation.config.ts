import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
    name: 'dtec_app1',
    dts: {
        generateTypes: false,
        consumeTypes: false,
    },
    exposes: {
        './app': './app/page.tsx',
    }
});

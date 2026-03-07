import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

// #region agent log
const _sharedConfig = { react: { eager: false }, 'react-dom': { eager: false } };
console.log('[MF-DEBUG][mf.config] run3 - eager values - react:', _sharedConfig.react.eager, '| react-dom:', _sharedConfig['react-dom'].eager);
// #endregion

export default createModuleFederationConfig({
  name: 'host',
  shared: {
    'next-auth': { singleton: true },
    'react': { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false },
  },
  remotes: {
    omb_admin_fe: 'omb_admin_fe@http://localhost:3001/_next/static/chunks/remoteEntry.js',
  },
  dts: {
    generateTypes: false,
    consumeTypes: false,
  },

});

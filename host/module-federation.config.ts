import { ModuleFederationRuntimePlugin } from '@module-federation/enhanced/runtime';

export default function (): ModuleFederationRuntimePlugin {
  return {
    name: 'host',
    beforeInit(args) {
      console.log('[build time inject] beforeInit: ', args);
      return args;
    },
    beforeLoadShare(args) {
      console.log('[build time inject] beforeLoadShare: ', args);
      return args;
    },
  };
}
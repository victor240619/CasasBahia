import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;
const hasBase44Runtime = Boolean(
  appId &&
  appId !== 'null' &&
  appId !== 'undefined' &&
  appBaseUrl &&
  appBaseUrl !== 'null' &&
  appBaseUrl !== 'undefined'
);

const localBase44Stub = {
  functions: {
    invoke: async () => {
      throw new Error('Base44 runtime nao configurado neste ambiente local.');
    },
  },
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {},
  },
};

export const base44 = hasBase44Runtime
  ? createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl,
    })
  : localBase44Stub;

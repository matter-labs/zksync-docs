// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@matterlabs/docs-nuxt-template'],
  modules: ['nuxt-gtag', '@vite-pwa/nuxt'],
  site: {
    name: 'ZKsync Docs',
    url: process.env.NUXT_SITE_ENV === 'production' ? 'https://docs.zksync.io' : 'https://staging-docs.zksync.io',
  },
  runtimeConfig: {
    public: {
      app: 'docs',
    },
  },
  routeRules: {
    '/build/tooling': { redirect: '/build/tooling/zksync-block-explorers' },
    '/build/tooling/foundry': { redirect: '/build/tooling/foundry/overview' },
    '/build/developer-reference/ethereum-differences': {
      redirect: '/build/developer-reference/ethereum-differences/evm-instructions',
    },
    '/build/developer-reference/era-contracts': { redirect: '/build/developer-reference/era-contracts/l1-contracts' },
    '/build/resources': { redirect: '/build/resources/glossary' },
    '/zk-stack/concepts': { redirect: '/zk-stack/concepts/transaction-lifecycle' },
    '/zk-stack/running-a-zk-chain': { redirect: '/zk-stack/running-a-zk-chain/locally' },
  },
  experimental: {
    defaults: {
      nuxtLink: {
        trailingSlash: 'remove',
      },
    },
  },
  pwa: {
    selfDestroying: true,
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    workbox: {
      cleanupOutdatedCaches: true,
      cacheId: 'zksync-docs-prod',
    },
    manifest: {
      name: 'ZKsync Developer Documentation',
      short_name: 'ZKsync Docs',
      description:
        'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and ZK chains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
      theme_color: '#F2F2F2',
      icons: [
        {
          src: '/zksync-icon_48.svg',
          sizes: '48x48',
          type: 'image/svg+xml',
        },
        {
          src: '/zksync-icon_48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/zksync-icon_64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: '/zksync-maskable.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/zksync-icon_180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/zksync-icon_192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/zksync-icon_512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
  },
  icon: {
    clientBundle: {
      // scan all components in the project and include icons
      scan: true,
      // include all custom collections in the client bundle
      includeCustomCollections: true,
      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },
  $production:
    process.env.NUXT_SITE_ENV === 'production'
      ? {
          gtag: {
            id: 'G-ELFWXSL45V',
          },
        }
      : {
          gtag: {
            enabled: false,
          },
        },
});

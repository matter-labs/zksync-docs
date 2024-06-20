// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [['github:matter-labs/docs-nuxt-template', { install: true }], ['github:zksync-sdk/sdk-docs']],
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo', 'nuxt-gtag', '@vite-pwa/nuxt'],
  site: {
    name: 'ZKsync Docs',
    url: process.env.NUXT_SITE_ENV ? 'https://staging-docs.zksync.io' : 'https://docs.zksync.io',
  },
  content: {
    sources: {
      sdk: {
        prefix: '/sdk',
        driver: 'github',
        repo: 'zksync-sdk/sdk-docs',
        branch: 'main',
        dir: 'content/sdk',
      },
    },
  },
  runtimeConfig: {
    public: {
      app: 'docs',
    },
  },
  routeRules: {
    '/api/search.json': { prerender: true },
    '/build/tooling': { redirect: '/build/tooling/zksync-block-explorers' },
    '/build/tooling/hardhat': { redirect: '/build/tooling/hardhat/getting-started' },
    '/build/tooling/foundry': { redirect: '/build/tooling/foundry/overview' },
    '/build/developer-reference/ethereum-differences': {
      redirect: '/build/developer-reference/ethereum-differences/evm-instructions',
    },
    '/build/developer-reference/era-contracts': { redirect: '/build/developer-reference/era-contracts/l1-contracts' },
    '/build/resources': { redirect: '/build/resources/glossary' },
    '/zk-stack/concepts': { redirect: '/zk-stack/concepts/transaction-lifecycle' },
    '/zk-stack/running-a-zk-chain': { redirect: '/zk-stack/running-a-zk-chain/locally' },
  },
  pwa: {
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
  $production: process.env.NUXT_SITE_ENV
    ? {}
    : {
        gtag: {
          id: 'G-ELFWXSL45V',
        },
      },
});

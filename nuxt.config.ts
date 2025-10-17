import redirects from './redirects';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@matterlabs/docs-nuxt-template'],
  modules: ['nuxt-gtag', '@vite-pwa/nuxt'],
  site: {
    name: 'ZKsync Docs',
    url: process.env.NUXT_SITE_ENV === 'production' ? 'https://docs.zksync.io' : 'https://staging-docs.zksync.io',
  },
  nitro: {
    plugins: ['./plugins/code-snippet-import.ts'],
    // prerender: {
    //   crawlLinks: true,
    //   routes: ['/zk-stack/prividium'],
    // },
  },
  components: [
    {
      path: '~/components',
      global: true,
    },
  ],
  runtimeConfig: {
    public: {
      app: 'docs',
    },
  },
  routeRules: {
    ...redirects,
    // '/zk-stack/prividium/': { redirect: '/zk-stack/prividium' },
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
        'ZKsync Docs bring you all information you need about our protocol, APIs, SDKs, ZK Stack, and ZKsync chains. Start with our guides and tutorials, or go deep into our architecture and protocol specification.',
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
      icons: [
        'heroicons:clipboard-document',
        'heroicons:chevron-right-20-solid',
        'heroicons:chevron-left-20-solid',
        'heroicons:hashtag-20-solid',
        'heroicons:chevron-down-20-solid',
        'heroicons:moon-20-solid',
        'heroicons:sun-20-solid',
        'heroicons:x-mark-20-solid',
        'heroicons:rocket-launch',
        'heroicons:arrow-up-right-20-solid',
        'heroicons:arrow-left-20-solid',
        'heroicons:check-circle-16-solid',
        'heroicons:beaker-solid',
        'heroicons:rocket-launch-solid',
        'heroicons:book-open-solid',
        'heroicons:square-3-stack-3d-16-solid',
        'heroicons:question-mark-circle',
        'heroicons:document-magnifying-glass-16-solid',
        'vscode-icons:file-type-bun',
        'vscode-icons:file-type-npm',
        'vscode-icons:file-type-pnpm',
        'vscode-icons:file-type-yarn',
        'vscode-icons:file-type-typescript',
        'vscode-icons:file-type-solidity',
      ],
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

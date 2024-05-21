// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    ['github:matter-labs/docs-nuxt-template#edit-links', { install: true }],
    ['github:zksync-sdk/sdk-docs#staging'],
  ],
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo'],
  routeRules: {
    '/api/search.json': { prerender: true },
  },
  site: {
    name: 'zkSync Docs',
    url: process.env.NUXT_SITE_ENV ? 'https://staging-docs.zksync.io' : 'https://docs.zksync.io',
  },
  content: {
    sources: {
      sdk: {
        prefix: '/sdk',
        driver: 'github',
        repo: 'zksync-sdk/sdk-docs',
        branch: 'staging',
        dir: 'content/sdk',
      },
    },
  },
  runtimeConfig: {
    public: {
      app: 'docs',
    },
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [['github:matter-labs/docs-nuxt-template', { install: true }]],
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo'],
  routeRules: {
    '/api/search.json': { prerender: true },
  },
  site: {
    name: 'zkSync Docs',
    url: process.env.NUXT_SITE_ENV ? 'https://staging-docs.zksync.io' : 'https://docs.zksync.io',
  },
  runtimeConfig: {
    public: {
      app: 'docs',
    },
  },
});

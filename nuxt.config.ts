// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [['github:matter-labs/docs-nuxt-template', { install: true }], ['github:zksync-sdk/sdk-docs#staging']],
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint', '@nuxtjs/seo', 'nuxt-gtag'],
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
  $production: process.env.NUXT_SITE_ENV
    ? {}
    : {
        gtag: {
          id: 'G-ELFWXSL45V',
        },
      },
});

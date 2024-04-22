import { getIconCollections } from '@egoist/tailwindcss-icons';
import { zksyncIcons } from './assets/zksync-icons';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: '/main.css' },
        { rel: 'stylesheet', href: '/katex.min.css' },
      ],
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxthq/studio',
    'nuxt-og-image',
    'nuxt-headlessui',
    '@nuxt/devtools',
  ],
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter((c) => ['UButton', 'UIcon'].includes(c.pascalName));

      globals.forEach((c) => (c.global = true));
    },
  },
  fonts: {
    families: [
      { name: 'Raleway', provider: 'google' },
      { name: 'Fira Code', provider: 'google' },
    ],
  },
  ui: {
    icons: {
      collections: {
        ...zksyncIcons,
        ...getIconCollections(['heroicons', 'simple-icons']),
      },
    },
  },
  routeRules: {
    '/api/search.json': { prerender: true },
  },
  devtools: {
    enabled: true,
  },
  typescript: {
    strict: false,
  },
  content: {
    markdown: {
      remarkPlugins: ['remark-math'],
      rehypePlugins: {
        'rehype-katex': {
          output: 'html',
          displayMode: true,
        },
      },
    },
    highlight: {
      langs: [
        'solidity',
        'go',
        'jsx',
        'swift',
        'python',
        'rust',
        'toml',
        'java',
        'xml',
        'graphql',
        'groovy',
        'asm',
        'c++',
      ],
      theme: {
        default: 'github-light',
        light: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
    },
  },
  nitro: {
    firebase: {
      gen: 2,
    },
  },
});

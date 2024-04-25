import { getIconCollections } from '@egoist/tailwindcss-icons';
import { zksyncIcons } from './assets/zksync-icons';
import { customIcons } from './assets/custom-icons';

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
    '@nuxt/image',
  ],
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter((c) => ['UButton', 'UIcon'].includes(c.pascalName));

      globals.forEach((c) => (c.global = true));
    },
  },
  image: {
    quality: 90,
    format: ['avif', 'webp'],
  },
  fonts: {
    families: [
      { name: 'Raleway', provider: 'google' },
      { name: 'Montserrat', provider: 'google' },
      { name: 'Fira Mono', provider: 'google' },
    ],
  },
  ui: {
    icons: {
      collections: {
        ...zksyncIcons,
        ...customIcons,
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
        'asm',
        'c++',
        'go',
        'graphql',
        'groovy',
        'java',
        'jsx',
        'python',
        'rust',
        'solidity',
        'swift',
        'toml',
        'xml',
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
  runtimeConfig: {
    public: {
      mdc: {
        useNuxtImage: true,
      },
    },
  },
});

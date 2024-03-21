// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/fonts', '@nuxthq/studio', 'nuxt-og-image'],
  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter((c) => ['UButton', 'UIcon', 'Test'].includes(c.pascalName));

      globals.forEach((c) => (c.global = true));
    },
  },
  ui: {
    icons: ['heroicons', 'simple-icons'],
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
  // deployment settings for Firebase
  nitro: {
    firebase: {
      gen: 2,
    },
  },
});

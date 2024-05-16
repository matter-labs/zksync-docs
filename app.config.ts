/**
 * Nuxt App Configuration that allows for runtime editing.
 * This content can be accessible in components with the
 * globally available `useAppConfig()`.
 */
export default defineAppConfig({
  seo: {
    siteName: 'zkSync Docs',
  },
  header: {
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/matter-labs/zksync-docs',
        target: '_blank',
        'aria-label': 'zkSync Docs on GitHub',
        title: 'zkSync Docs on GitHub',
      },
    ],
  },
});

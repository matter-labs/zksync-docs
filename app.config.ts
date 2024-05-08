/**
 * Nuxt App Configuration that allows for runtime editing.
 * This content can be accessible in components with the
 * globally available `useAppConfig()`.
 */
export default defineAppConfig({
  seo: {
    siteName: 'ZKsync Docs',
  },
  header: {
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/matter-labs/zksync-docs',
        target: '_blank',
        'aria-label': 'ZKsync Docs on GitHub',
        title: 'ZKsync Docs on GitHub',
      },
    ],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      edit: 'https://github.com/matter-labs/zksync-docs/edit/staging/content',
      feedback: 'https://github.com/matter-labs/zksync-docs/issues/new?labels=documentation',
    },
  },
});

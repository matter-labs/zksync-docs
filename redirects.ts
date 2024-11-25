// Redirects are stored in a separate file to not clutter nuxt config.

// List of all redirects for the website.
// This is mostly helpful to make sure that old links are not broken.
const redirects = {
  '/build/tooling': { redirect: '/build/tooling/zksync-block-explorers' },
  '/build/tooling/foundry': { redirect: '/build/tooling/foundry/overview' },
  '/build/developer-reference/ethereum-differences': {
    redirect: '/build/developer-reference/ethereum-differences/evm-instructions',
  },
  '/build/developer-reference/era-contracts': { redirect: '/build/developer-reference/era-contracts/l1-contracts' },
  '/build/resources': { redirect: '/build/resources/glossary' },
  '/zk-stack/concepts': { redirect: '/zk-stack/concepts/transaction-lifecycle' },
  '/zk-stack/running-a-zk-chain': { redirect: '/zk-stack/running-a-zk-chain/locally' },
};

// In Nov 2024, the structure of docs has been reworked significantly, so all the old links were moved to new places.
const docsReorgRedirects = {
  '/zksync-node': { redirect: 'TODO' },
  '/zk-stack': { redirect: 'TODO' },
  '/build': { redirect: 'TODO' },
};

export default {
  ...redirects,
  ...docsReorgRedirects,
};

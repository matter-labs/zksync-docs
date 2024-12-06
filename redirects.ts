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
  '/build/connect-to-zksync': { redirect: '/zksync-era/environment' },
  '/build/start-coding/quick-start': { redirect: '/zksync-era/guides/quick-start' },
  '/build/start-coding/zksync-101': { redirect: '/zksync-era/guides/zksync-101' },
  '/build/zksync-cli': { redirect: '/zksync-era/tooling/zksync-cli' },
  '/build/zksync-sso': { redirect: '/zksync-era/unique-features/zksync-sso' },
  '/build/tooling/zksync-block-explorers': { redirect: '/zksync-era/tooling/block-explorers' },
  '/build/tooling/hardhat': { redirect: '/zksync-era/tooling/hardhat' },
  '/build/tooling/foundry': { redirect: '/zksync-era/tooling/foundry' },
  '/build/test-and-debug/hardhat': { redirect: '/zksync-era/guides/testing/testing-with-hardhat' },
  '/build/test-and-debug/foundry': { redirect: '/zksync-era/guides/testing/testing-with-foundry' },
  '/build/test-and-debug': { redirect: '/zksync-era/tooling/local-setup' },
  '/build/developer-reference/protocol': { redirect: '/zksync-protocol/rollup' },
  '/build/developer-reference/addresses/zk-chain-addresses': { redirect: '/zk-stack/zk-chain-addresses' },
  '/build/developer-reference/batches-and-l2-blocks': { redirect: '/zksync-protocol/rollup/blocks' },
  '/build/developer-reference/era-vm': { redirect: '/zksync-protocol/vm' },
  '/build/developer-reference/best-practices': { redirect: '/zksync-era/security-best-practices' },
  '/build/developer-reference/ethereum-differences': { redirect: '/zksync-protocol/differences' },
  '/build/developer-reference/account-abstraction': { redirect: '/zksync-protocol/account-abstraction' },
  '/build/developer-reference/era-contracts': { redirect: '/zksync-protocol/contracts' },
  '/build/developer-reference/bridging-assets': { redirect: '/zksync-protocol/rollup/bridging-assets' },
  '/build/developer-reference/fee-model': { redirect: '/zksync-protocol/rollup/fee-model' },
  '/build/developer-reference/handling-pubdata-in-boojum': { redirect: '/zksync-protocol/contracts/handling-pubdata' },
  '/build/developer-reference/l1-l2-interoperability': { redirect: '/zksync-protocol/rollup/l1_l2_communication' },
  '/build/api-reference': { redirect: '/zksync-protocol/api' },
  '/build/contributing-to-documentation': { redirect: '/zksync-era/contributing/documentation' },
  '/build/resources/glossary': { redirect: '/zksync-protocol/glossary' },
  '/build/resources/upgrades-and-migrations': { redirect: '/zksync-protocol/upgrades-and-migrations' },
  '/build/resources/audit-bug-bounty': { redirect: '/zksync-protocol/security/bug-bounty' },
  '/build/resources/contribution-track': { redirect: '/zksync-era/contributing' },
  '/build/resources/community-channels': { redirect: '/' },
  '/build/resources/withdrawal-delay': { redirect: '/zksync-protocol/security/withdrawal-delay' },
  '/zk-stack/concepts': { redirect: '/zksync-protocol/rollup' },
  '/zk-stack/components/smart-contracts/system-contracts': { redirect: '/zksync-protocol/contracts/system-contracts' },
  '/zk-stack/components/smart-contracts': { redirect: '/zksync-protocol/contracts' },
  '/zk-stack/components/shared-bridges': { redirect: '/zksync-protocol/contracts/l1-contracts/shared-bridges' },
  '/zk-stack/components/zksync-evm/bootloader': { redirect: '/zksync-protocol/contracts/bootloader' },
  '/zk-stack/components/zksync-evm': { redirect: '/zksync-protocol/vm' },
  '/zk-stack/components/zksync-evm/vm-specification': { redirect: '/zksync-protocol/vm' },
  '/zk-stack/components/prover': { redirect: '/zksync-protocol/prover' },
  '/zk-stack/components/compiler': { redirect: '/zksync-protocol/compiler' },
  '/zk-stack/components/transaction-filtering': { redirect: '/zk-stack/extending/transaction-filtering' },
  '/zk-stack/running-a-zk-chain': { redirect: '/zk-stack/running' },
  '/build/developer-reference': { redirect: '/zksync-protocol' },
  '/zksync-node': { redirect: '/zksync-era/tooling/external-node' },
  '/build': { redirect: '/zksync-era' },
};

export default {
  ...redirects,
  ...docsReorgRedirects,
};

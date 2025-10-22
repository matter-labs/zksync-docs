const defaultCategory = 'ZKsync Docs';

// Order by most specific to least specific.
// e.g. `/js/ethers/api/v5` before `/js/ethers`
const categories = [
  ['/zksync-network/guides/quick-start', 'Quick Start ZKsync'],
  ['/zksync-network/guides/zksync-101', 'ZKsync 101 Tutorial'],
  ['/zksync-network/tooling/zksync-cli', 'ZKsync CLI'],
  ['/zksync-network/tooling/hardhat', 'Hardhat'],
  ['/zksync-network/tooling/foundry/overview', 'Foundry'],
  ['/zk-stack/running/quickstart', 'Running a ZK Chain'],
  ['/zk-stack', 'ZK Stack'],
  ['/zksync-network/ecosystem', 'Ecosystem'],
] as const;

/**
 * Returns the category of the current route.
 * Primarily this is for the algolia docsearch
 */
export const useCategory = () => {
  const route = useRoute();
  const category = ref(defaultCategory);
  // for if we ever have i18n routes, remove the language prefix
  // const langAgnosticPath = route.path.replace(/\/\w\w(-\w\w)?\//, '');
  for (const [path, label] of categories) {
    if (route.path.startsWith(path)) {
      category.value = label;
      break;
    }
  }
  return category;
};

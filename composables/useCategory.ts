const defaultCategory = 'ZKsync Docs';

// Order by most specific to least specific.
// e.g. `/js/ethers/api/v5` before `/js/ethers`
const categories = [
  ['/build/start-coding/quick-start', 'Quick Start ZKsync'],
  ['/build/start-coding/zksync-101', 'ZKsync 101 Tutorial'],
  ['/build/zksync-cli', 'ZKsync CLI'],
  ['/build/tooling/hardhat', 'Hardhat'],
  ['/build/tooling/foundry', 'Foundry'],
  ['/build/developer-reference', 'Developer Reference'],
  ['/build/api-reference', 'ZKsync API'],
  ['/build/resources', 'Resources'],
  ['/build', 'Build'],
  ['/zk-stack/running-a-zk-chain', 'Running a ZK Chain'],
  ['/zk-stack', 'ZK Stack'],
  ['/zksync-node', 'ZKsync Node'],
  ['/ecosystem', 'Ecosystem'],
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

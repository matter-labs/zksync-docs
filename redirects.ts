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
// Note: glob redirects don't work outside of the local environment, so we have to specify each redirect separately.
const docsReorgRedirects = {
  '/build': { redirect: '/zksync-era' },
  '/build/connect-to-zksync': { redirect: '/zksync-era/environment' },

  // Quick start
  '/build/start-coding/quick-start': { redirect: '/zksync-era/guides/quick-start' },
  '/build/start-coding/quick-start/deploy-your-first-contract': {
    redirect: '/zksync-era/guides/quick-start/deploy-your-first-contract',
  },
  '/build/start-coding/quick-start/erc20-token': { redirect: '/zksync-era/guides/quick-start/erc20-token' },
  '/build/start-coding/quick-start/paymasters-introduction': {
    redirect: '/zksync-era/guides/quick-start/paymasters-introduction',
  },

  // ZKsync 101
  '/build/start-coding/zksync-101': { redirect: '/zksync-era/guides/zksync-101' },
  '/build/start-coding/zksync-101/hello-zksync': { redirect: '/zksync-era/guides/zksync-101/hello-zksync' },
  '/build/start-coding/zksync-101/contract-factory': { redirect: '/zksync-era/guides/zksync-101/contract-factory' },
  '/build/start-coding/zksync-101/testing': { redirect: '/zksync-era/guides/zksync-101/testing' },
  '/build/start-coding/zksync-101/upgrading': { redirect: '/zksync-era/guides/zksync-101/upgrading' },

  // ZKsync CLI
  '/build/zksync-cli': { redirect: '/zksync-era/tooling/zksync-cli' },
  '/build/zksync-cli/reading-transaction-data': { redirect: '/zksync-era/tooling/zksync-cli/reading-transaction-data' },
  '/build/zksync-cli/wallet-actions': { redirect: '/zksync-era/tooling/zksync-cli/wallet-actions' },
  '/build/zksync-cli/bridging': { redirect: '/zksync-era/tooling/zksync-cli/bridging' },
  '/build/zksync-cli/interact-with-contracts': { redirect: '/zksync-era/tooling/zksync-cli/interact-with-contracts' },
  '/build/zksync-cli/creating-projects': { redirect: '/zksync-era/tooling/zksync-cli/creating-projects' },
  '/build/zksync-cli/running-a-node': { redirect: '/zksync-era/tooling/zksync-cli/running-a-node' },
  '/build/zksync-cli/configuring-chains': { redirect: '/zksync-era/tooling/zksync-cli/configuring-chains' },
  '/build/zksync-cli/troubleshooting': { redirect: '/zksync-era/tooling/zksync-cli/troubleshooting' },
  '/build/zksync-cli/reference': { redirect: '/zksync-era/tooling/zksync-cli/reference' },
  '/build/zksync-cli/reference/zksync-cli-bridge': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-bridge',
  },
  '/build/zksync-cli/reference/zksync-cli-config-chains': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-config-chains',
  },
  '/build/zksync-cli/reference/zksync-cli-contract': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-contract',
  },
  '/build/zksync-cli/reference/zksync-cli-create': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-create',
  },
  '/build/zksync-cli/reference/zksync-cli-dev': { redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-dev' },
  '/build/zksync-cli/reference/zksync-cli-transaction': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-transaction',
  },
  '/build/zksync-cli/reference/zksync-cli-wallet': {
    redirect: '/zksync-era/tooling/zksync-cli/reference/zksync-cli-wallet',
  },

  // ZKsync SSO
  '/build/zksync-sso': { redirect: '/zksync-era/unique-features/zksync-sso' },
  '/build/zksync-sso/getting-started': { redirect: '/zksync-era/unique-features/zksync-sso/getting-started' },
  '/build/zksync-sso/architecture': { redirect: '/zksync-era/unique-features/zksync-sso/architecture' },
  '/build/zksync-sso/features': { redirect: '/zksync-era/unique-features/zksync-sso/architecture' },
  '/zksync-era/unique-features/zksync-sso/features': {
    redirect: '/zksync-era/unique-features/zksync-sso/architecture',
  },
  '/build/zksync-sso/interfaces': { redirect: '/zksync-era/unique-features/zksync-sso/sessions' },
  '/zksync-era/unique-features/zksync-sso/interfaces': { redirect: '/zksync-era/unique-features/zksync-sso/sessions' },
  '/build/zksync-sso/transaction-flow': { redirect: '/zksync-era/unique-features/zksync-sso/transaction-flow' },
  '/build/zksync-sso/transaction-fees': { redirect: '/zksync-era/unique-features/zksync-sso/faq' },
  '/zksync-era/unique-features/zksync-sso/transaction-fees': { redirect: '/zksync-era/unique-features/zksync-sso/faq' },
  '/build/zksync-sso/supported-environments': {
    redirect: '/zksync-era/unique-features/zksync-sso/supported-environments',
  },
  '/build/zksync-sso/faqs': { redirect: '/zksync-era/unique-features/zksync-sso/faqs' },

  '/build/tooling/zksync-block-explorers': { redirect: '/zksync-era/tooling/block-explorers' },

  // Hardhat
  '/build/tooling/hardhat': { redirect: '/zksync-era/tooling/hardhat' },
  '/build/tooling/hardhat/installation': { redirect: '/zksync-era/tooling/hardhat/installation' },
  '/build/tooling/hardhat/guides': { redirect: '/zksync-era/tooling/hardhat/guides/getting-started' },
  '/build/tooling/hardhat/guides/getting-started': { redirect: '/zksync-era/tooling/hardhat/guides/getting-started' },
  '/build/tooling/hardhat/guides/migrating-to-zksync': {
    redirect: '/zksync-era/tooling/hardhat/guides/migrating-to-zksync',
  },
  '/build/tooling/hardhat/guides/compiling-libraries': {
    redirect: '/zksync-era/tooling/hardhat/guides/compiling-libraries',
  },

  // Foundry
  '/build/tooling/foundry': { redirect: '/zksync-era/tooling/foundry' },
  '/build/tooling/foundry/overview': { redirect: '/zksync-era/tooling/foundry/overview' },
  '/build/tooling/foundry/installation': { redirect: '/zksync-era/tooling/foundry/installation' },
  '/build/tooling/foundry/getting-started': { redirect: '/zksync-era/tooling/foundry/getting-started' },
  '/build/tooling/foundry/migration-guide': { redirect: '/zksync-era/tooling/foundry/migration-guide' },
  '/build/tooling/foundry/migration-guide/overview': {
    redirect: '/zksync-era/tooling/foundry/migration-guide/overview',
  },
  '/build/tooling/foundry/migration-guide/compilation': {
    redirect: '/zksync-era/tooling/foundry/migration-guide/compilation',
  },
  '/build/tooling/foundry/migration-guide/deployment': {
    redirect: '/zksync-era/tooling/foundry/migration-guide/deployment',
  },
  '/build/tooling/foundry/migration-guide/testing': { redirect: '/zksync-era/tooling/foundry/migration-guide/testing' },

  // Test and debug
  '/build/test-and-debug/hardhat': { redirect: '/zksync-era/guides/testing/testing-with-hardhat' },
  '/build/test-and-debug/foundry': { redirect: '/zksync-era/guides/testing/testing-with-foundry' },
  '/build/test-and-debug/in-memory-node': { redirect: '/zksync-era/tooling/local-setup/in-memory-node' },
  '/build/test-and-debug': { redirect: '/zksync-era/tooling/local-setup' },

  // Dev reference
  '/build/developer-reference': { redirect: '/zksync-protocol' },
  '/build/developer-reference/protocol': { redirect: '/zksync-protocol/rollup' },
  '/build/developer-reference/migrate-era-to-chain': {
    redirect: '/zksync-protocol/contracts/l1-contracts/shared-bridges',
  },
  '/build/developer-reference/addresses/zk-chain-addresses': { redirect: '/zk-stack/zk-chain-addresses' },
  '/build/developer-reference/batches-and-l2-blocks': { redirect: '/zksync-protocol/rollup/blocks' },
  '/build/developer-reference/era-vm': { redirect: '/zksync-protocol/vm' },
  '/build/developer-reference/best-practices': { redirect: '/zksync-era/security-best-practices' },
  '/build/developer-reference/bridging-assets': { redirect: '/zksync-protocol/rollup/bridging-assets' },
  '/build/developer-reference/handling-pubdata-in-boojum': { redirect: '/zksync-protocol/contracts/handling-pubdata' },
  '/build/developer-reference/l1-l2-interoperability': { redirect: '/zksync-protocol/rollup/l1_l2_communication' },

  // Ethereum differences
  '/build/developer-reference/ethereum-differences': { redirect: '/zksync-protocol/differences' },
  '/build/developer-reference/ethereum-differences/evm-instructions': {
    redirect: '/zksync-protocol/differences/evm-instructions',
  },
  '/build/developer-reference/ethereum-differences/nonces': { redirect: '/zksync-protocol/differences/nonces' },
  '/build/developer-reference/ethereum-differences/libraries': { redirect: '/zksync-protocol/differences/libraries' },
  '/build/developer-reference/ethereum-differences/pre-compiles': {
    redirect: '/zksync-protocol/differences/pre-compiles',
  },
  '/build/developer-reference/ethereum-differences/native-vs-eip4337': {
    redirect: '/zksync-protocol/differences/native-vs-eip4337',
  },
  '/build/developer-reference/ethereum-differences/contract-deployment': {
    redirect: '/zksync-protocol/differences/contract-deployment',
  },

  // Account abstraction
  '/build/developer-reference/account-abstraction': { redirect: '/zksync-protocol/account-abstraction' },
  '/build/developer-reference/account-abstraction/design': { redirect: '/zksync-protocol/account-abstraction/design' },
  '/build/developer-reference/account-abstraction/paymasters': {
    redirect: '/zksync-protocol/account-abstraction/paymasters',
  },
  '/build/developer-reference/account-abstraction/building-smart-accounts': {
    redirect: '/zksync-protocol/account-abstraction/building-smart-accounts',
  },
  '/build/developer-reference/account-abstraction/signature-validation': {
    redirect: '/zksync-protocol/account-abstraction/signature-validation',
  },
  '/build/developer-reference/account-abstraction/extending-4337': {
    redirect: '/zksync-protocol/account-abstraction/extending-4337',
  },

  // Era contracts
  '/build/developer-reference/era-contracts': { redirect: '/zksync-protocol/contracts' },
  '/build/developer-reference/era-contracts/l1-contracts': { redirect: '/zksync-protocol/contracts/l1-contracts' },
  '/build/developer-reference/era-contracts/system-contracts': {
    redirect: '/zksync-protocol/contracts/system-contracts',
  },
  '/build/developer-reference/era-contracts/l1-ecosystem-contracts': {
    redirect: '/zksync-protocol/contracts/l1-contracts//l1-ecosystem-contracts',
  },
  '/build/developer-reference/era-contracts/pubdata-post-4844': {
    redirect: '/zksync-protocol/contracts/pubdata-post-4844',
  },
  '/build/developer-reference/era-contracts/handling-l1-l2-ops': {
    redirect: '/zksync-protocol/contracts/handling-l1-l2-ops',
  },
  '/build/developer-reference/era-contracts/handling-pubdata': {
    redirect: '/zksync-protocol/contracts/handling-pubdata',
  },
  // /build/developer-reference/era-contracts/migrate-era-to-chain was removed

  // Fee model
  '/build/developer-reference/fee-model': { redirect: '/zksync-protocol/rollup/fee-model' },
  '/build/developer-reference/fee-model/how-l2-gas-price-works': {
    redirect: '/zksync-protocol/rollup/fee-model/how-l2-gas-price-works',
  },
  '/build/developer-reference/fee-model/how-we-charge-for-pubdata': {
    redirect: '/zksync-protocol/rollup/fee-model/how-we-charge-for-pubdata',
  },

  // API reference
  '/build/api-reference': { redirect: '/zksync-protocol/api' },
  '/build/api-reference/conventions': { redirect: '/zksync-protocol/api/conventions' },
  '/build/api-reference/zks-rpc': { redirect: '/zksync-protocol/api/zks-rpc' },
  '/build/api-reference/debug-rpc': { redirect: '/zksync-protocol/api/debug-rpc' },
  '/build/api-reference/ethereum-rpc': { redirect: '/zksync-protocol/api/ethereum-rpc' },
  '/build/api-reference/pub-sub-rpc': { redirect: '/zksync-protocol/api/pub-sub-rpc' },

  // Contributing to documentation
  '/build/contributing-to-documentation': { redirect: '/zksync-era/contributing/documentation' },
  '/build/contributing-to-documentation/contribution-guidelines': {
    redirect: '/zksync-era/contributing/documentation/contribution-guidelines',
  },
  '/build/contributing-to-documentation/documentation-styleguide': {
    redirect: '/zksync-era/contributing/documentation/documentation-styleguide',
  },

  // Resources
  '/build/resources/glossary': { redirect: '/zksync-protocol/glossary' },
  '/build/resources/upgrades-and-migrations': { redirect: '/zksync-protocol/upgrades-and-migrations' },
  '/build/resources/audit-bug-bounty': { redirect: '/zksync-protocol/security/bug-bounty' },
  '/build/resources/contribution-track': { redirect: '/zksync-era/contributing' },
  '/build/resources/community-channels': { redirect: '/' },
  '/build/resources/withdrawal-delay': { redirect: '/zksync-protocol/security/withdrawal-delay' },

  // ZK Stack concepts
  '/zk-stack/concepts': { redirect: '/zksync-protocol/rollup' },
  '/zk-stack/concepts/transaction-lifecycle': { redirect: '/zksync-protocol/rollup/transaction-lifecycle' },
  '/zk-stack/concepts/blocks': { redirect: '/zksync-protocol/rollup/blocks' },
  '/zk-stack/concepts/fee-mechanism': { redirect: '/zksync-protocol/rollup/fee-model' },
  '/zk-stack/concepts/finality': { redirect: '/zksync-protocol/rollup/finality' },
  // /zk-stack/concepts/system-upgrades was removed
  '/zk-stack/concepts/zk-chains': { redirect: '/zk-stack/zk-chains' },
  '/zk-stack/concepts/account-abstraction': { redirect: '/zksync-protocol/account-abstraction' },
  '/zk-stack/concepts/l1_l2_communication': { redirect: '/zksync-protocol/rollup/l1_l2_communication' },

  // ZK Stack components
  '/zk-stack/components/sequencer-server': { redirect: '/zk-stack/components/server' },
  '/zk-stack/components/smart-contracts': { redirect: '/zksync-protocol/contracts' },
  '/zk-stack/components/smart-contracts/system-contracts': { redirect: '/zksync-protocol/contracts/system-contracts' },
  '/zk-stack/components/shared-bridges': { redirect: '/zksync-protocol/contracts/l1-contracts/shared-bridges' },
  '/zk-stack/components/zksync-evm/bootloader': { redirect: '/zksync-protocol/contracts/bootloader' },
  '/zk-stack/components/zksync-evm': { redirect: '/zksync-protocol/vm' },
  '/zk-stack/components/zksync-evm/vm-specification': { redirect: '/zksync-protocol/vm' },
  '/zk-stack/components/transaction-filtering': { redirect: '/zk-stack/extending/transaction-filtering' },

  // ZK Stack components: prover
  // `/zk-stack/components/prover` doesn't get a redirect: it contains a new page at the same path that works better
  '/zk-stack/components/prover/zk-terminology': { redirect: '/zksync-protocol/circuits/zk-terminology' },
  '/zk-stack/components/prover/boojum-gadgets': { redirect: '/zksync-protocol/circuits/boojum-gadgets' },
  '/zk-stack/components/prover/boojum-function-check-if-satisfied': {
    redirect: '/zksync-protocol/circuits/boojum-function-check-if-satisfied',
  },
  '/zk-stack/components/prover/circuits': { redirect: '/zksync-protocol/circuits/circuits' },
  '/zk-stack/components/prover/circuits/index': { redirect: '/zksync-protocol/circuits/circuits/index' },
  '/zk-stack/components/prover/circuits/storage-application': {
    redirect: '/zksync-protocol/circuits/circuits/storage-application',
  },
  '/zk-stack/components/prover/circuits/circuit-testing': {
    redirect: '/zksync-protocol/circuits/circuits/circuit-testing',
  },
  '/zk-stack/components/prover/circuits/demux-log-queue': {
    redirect: '/zksync-protocol/circuits/circuits/demux-log-queue',
  },
  '/zk-stack/components/prover/circuits/keccak-round-function': {
    redirect: '/zksync-protocol/circuits/circuits/keccak-round-function',
  },
  '/zk-stack/components/prover/circuits/log-sorter': { redirect: '/zksync-protocol/circuits/circuits/log-sorter' },
  '/zk-stack/components/prover/circuits/ram-permutation': {
    redirect: '/zksync-protocol/circuits/circuits/ram-permutation',
  },
  '/zk-stack/components/prover/circuits/sha256-round-function': {
    redirect: '/zksync-protocol/circuits/circuits/sha256-round-function',
  },
  '/zk-stack/components/prover/circuits/code-decommitter': {
    redirect: '/zksync-protocol/circuits/circuits/code-decommitter',
  },
  '/zk-stack/components/prover/circuits/ecrecover': { redirect: '/zksync-protocol/circuits/circuits/ecrecover' },
  '/zk-stack/components/prover/circuits/l1-messages-hasher': {
    redirect: '/zksync-protocol/circuits/circuits/l1-messages-hasher',
  },
  '/zk-stack/components/prover/circuits/main-vm': { redirect: '/zksync-protocol/circuits/circuits/main-vm' },
  '/zk-stack/components/prover/circuits/sorting': { redirect: '/zksync-protocol/circuits/circuits/sorting' },
  '/zk-stack/components/prover/circuits/sorting/sort-decommitments': {
    redirect: '/zksync-protocol/circuits/circuits/sorting/sort-decommitments',
  },
  '/zk-stack/components/prover/circuits/sorting/storage-sorter': {
    redirect: '/zksync-protocol/circuits/circuits/sorting/storage-sorter',
  },
  '/zk-stack/components/prover/circuits/sorting/log-sorter': {
    redirect: '/zksync-protocol/circuits/circuits/sorting/log-sorter',
  },

  // ZK Stack components: compiler
  '/zk-stack/components/compiler': { redirect: '/zksync-protocol/compiler' },
  '/zk-stack/components/compiler/specification': { redirect: '/zksync-protocol/compiler/specification' },
  '/zk-stack/components/compiler/specification/index': { redirect: '/zksync-protocol/compiler/specification/index' },
  '/zk-stack/components/compiler/specification/binary-layout': {
    redirect: '/zksync-protocol/compiler/specification/binary-layout',
  },
  '/zk-stack/components/compiler/specification/system-contracts': {
    redirect: '/zksync-protocol/compiler/specification/system-contracts',
  },
  '/zk-stack/components/compiler/specification/instructions': {
    redirect: '/zksync-protocol/compiler/specification/instructions',
  },
  '/zk-stack/components/compiler/specification/instructions/index': {
    redirect: '/zksync-protocol/compiler/specification/instructions/index',
  },
  '/zk-stack/components/compiler/specification/instructions/evm': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/sha3': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/sha3',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/logical': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/logical',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/index': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/index',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/call': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/call',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/arithmetic': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/arithmetic',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/create': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/create',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/environment': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/environment',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/bitwise': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/bitwise',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/return': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/return',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/memory': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/memory',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/stack': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/stack',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/block': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/block',
  },
  '/zk-stack/components/compiler/specification/instructions/evm/logging': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evm/logging',
  },
  '/zk-stack/components/compiler/specification/instructions/extensions': {
    redirect: '/zksync-protocol/compiler/specification/instructions/extensions',
  },
  '/zk-stack/components/compiler/specification/instructions/extensions/verbatim': {
    redirect: '/zksync-protocol/compiler/specification/instructions/extensions/verbatim',
  },
  '/zk-stack/components/compiler/specification/instructions/extensions/call': {
    redirect: '/zksync-protocol/compiler/specification/instructions/extensions/call',
  },
  '/zk-stack/components/compiler/specification/instructions/extensions/index': {
    redirect: '/zksync-protocol/compiler/specification/instructions/extensions/index',
  },
  '/zk-stack/components/compiler/specification/instructions/evmla': {
    redirect: '/zksync-protocol/compiler/specification/instructions/evmla',
  },
  '/zk-stack/components/compiler/specification/instructions/yul': {
    redirect: '/zksync-protocol/compiler/specification/instructions/yul',
  },
  '/zk-stack/components/compiler/specification/evmla-translator': {
    redirect: '/zksync-protocol/compiler/specification/evmla-translator',
  },
  '/zk-stack/components/compiler/specification/code-separation': {
    redirect: '/zksync-protocol/compiler/specification/code-separation',
  },
  '/zk-stack/components/compiler/specification/exception-handling': {
    redirect: '/zksync-protocol/compiler/specification/exception-handling',
  },
  '/zk-stack/components/compiler/toolchain': { redirect: '/zksync-protocol/compiler/toolchain' },
  '/zk-stack/components/compiler/toolchain/vyper': { redirect: '/zksync-protocol/compiler/toolchain/vyper' },
  '/zk-stack/components/compiler/toolchain/index': { redirect: '/zksync-protocol/compiler/toolchain/index' },
  '/zk-stack/components/compiler/toolchain/llvm': { redirect: '/zksync-protocol/compiler/toolchain/llvm' },
  '/zk-stack/components/compiler/toolchain/solidity': { redirect: '/zksync-protocol/compiler/toolchain/solidity' },

  '/zksync-protocol/compiler/toolchain/solidity': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/' },
  '/zksync-protocol/compiler/toolchain/vyper': { redirect: 'https://matter-labs.github.io/era-compiler-vyper/latest/' },
  '/zksync-protocol/compiler/specification/code-separation': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/01-code-separation.html' },
  '/zksync-protocol/compiler/specification/evmla-translator': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/02-evm-assembly-translator.html' },
  '/zksync-protocol/compiler/specification/system-contracts': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/03-system-contracts.html' },
  '/zksync-protocol/compiler/specification/exception-handling': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/04-exception-handling.html' },
  '/zksync-protocol/compiler/specification/instructions': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/01-reference.html' },
  '/zksync-protocol/compiler/specification/instructions/index': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/01-reference.html' },
  '/zksync-protocol/compiler/specification/instructions/evm': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/01-reference.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/arithmetic': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/02-arithmetic.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/bitwise': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/03-bitwise.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/block': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/04-block.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/call': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/05-calls.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/create': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/06-create.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/environment': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/07-environment.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/logging': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/08-logging.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/logical': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/09-logical.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/memory': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/10-memory.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/return': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/11-return.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/sha3': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/12-sha3.html' },
  '/zksync-protocol/compiler/specification/instructions/evm/stack': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/02-evm/13-stack.html' },
  '/zksync-protocol/compiler/specification/instructions/evmla': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/03-evm-assembly.html' },
  '/zksync-protocol/compiler/specification/instructions/yul': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/05-instructions/04-yul.html' },
  '/zksync-protocol/compiler/specification/instructions/extensions': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/06-extensions.html' },
  '/zksync-protocol/compiler/specification/instructions/extensions/index': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/06-extensions.html' },
  '/zksync-protocol/compiler/specification/instructions/extensions/call': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/06-extensions.html' },
  '/zksync-protocol/compiler/specification/instructions/extensions/verbatim': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/06-extensions.html' },
  '/zksync-protocol/compiler/specification/binary-layout': { redirect: 'https://matter-labs.github.io/era-compiler-solidity/latest/eravm/07-binary-layout.html' },

  // Running a zk chain
  '/zk-stack/running-a-zk-chain': { redirect: '/zk-stack/running' },
  '/zk-stack/running-a-zk-chain/quickstart': { redirect: '/zk-stack/running/quickstart' },
  '/zk-stack/running-a-zk-chain/using-a-local-zk-chain': { redirect: '/zk-stack/running/using-a-local-zk-chain' },
  '/zk-stack/running-a-zk-chain/custom-base-tokens': { redirect: '/zk-stack/running/custom-base-tokens' },
  '/zk-stack/running-a-zk-chain/proving': { redirect: '/zk-stack/running/proving' },
  '/zk-stack/running-a-zk-chain/configurations': { redirect: '/zk-stack/running/configurations' },
  '/zk-stack/running-a-zk-chain/production': { redirect: '/zk-stack/running/production' },
  '/zk-stack/running-a-zk-chain/raas': { redirect: '/zk-stack/running/raas' },
  '/zk-stack/running-a-zk-chain/validium': { redirect: '/zk-stack/running/validium' },

  '/zksync-node': { redirect: '/zksync-era/tooling/external-node' },
};

export default {
  ...redirects,
  ...docsReorgRedirects,
};

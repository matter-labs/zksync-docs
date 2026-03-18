import type { IPageStepConfig } from '../utils/types';

const steps: IPageStepConfig = {
  'zksync-network/quick-start/deploy-your-first-contract': {
    'select-local-node-deploy': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'select-hardhat-deploy': {
      action: 'clickButtonByText',
      buttonText: 'Hardhat',
    },
    'init-hardhat-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
      projectFolder: 'hardhat-example-viem',
      projectTemplate: 'hardhat-v3-viem',
    },
    'install-hardhat-openzeppelin': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      useSetCommand: 'npm install @openzeppelin/contracts',
    },
    'configure-hardhat-local-config': {
      action: 'modifyFile',
      filepath: 'tests-output/hardhat-example-viem/hardhat.config.ts',
      atLine: 22,
      removeLines: [22, '-->', 37],
    },
    'create-hardhat-contract-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      useSetCommand: 'touch contracts/QuickstartToken.sol',
    },
    'add-token-contract': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-viem/contracts/QuickstartToken.sol',
    },
    'create-hardhat-ignition-module': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      useSetCommand: 'touch ignition/modules/QuickstartToken.ts',
    },
    'add-hardhat-ignition-module': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-viem/ignition/modules/QuickstartToken.ts',
    },
    'compile-hardhat-project': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
    },
    'deploy-hardhat-contract': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
    },
  },
  'zksync-network/quick-start/interact-with-your-contract': {
    'select-local-node-interact': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'select-hardhat-viem-interact': {
      action: 'clickButtonByText',
      buttonText: 'Hardhat with viem',
    },
    'create-hardhat-viem-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      useSetCommand: 'touch scripts/interact.ts',
    },
    'add-hardhat-viem-script': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-viem/scripts/interact.ts',
    },
    'create-hh-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      useSetCommand: 'touch .env',
    },
    'set-hardhat-viem-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/hardhat-example-viem/ignition/deployments/chain-31337/deployed_addresses.json',
      envFilepath: 'tests-output/hardhat-example-viem/.env',
      variableName: 'CONTRACT_ADDRESS',
      selector: { regex: /(?<="QuickstartToken#QuickstartToken"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'run-hardhat-viem-script': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-viem',
      preCommand: 'set -a && . ./.env && set +a && <COMMAND>',
      checkForOutput: 'Recipient balance increase: 10.0',
    },
  },
};

export default steps;

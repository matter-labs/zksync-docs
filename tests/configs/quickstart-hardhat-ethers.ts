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
      projectFolder: 'hardhat-example-ethers',
      projectTemplate: 'hardhat-v3-ethers',
    },
    'configure-hardhat-local-config': {
      action: 'modifyFile',
      filepath: 'tests-output/hardhat-example-ethers/hardhat.config.ts',
      atLine: 22,
      removeLines: [22, '-->', 37],
    },
    'create-hardhat-contract-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
      useSetCommand: 'touch contracts/ZeekMessages.sol',
    },
    'add-zeek-messages-contract': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-ethers/contracts/ZeekMessages.sol',
    },
    'create-hardhat-ignition-module': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
      useSetCommand: 'touch ignition/modules/ZeekMessages.ts',
    },
    'add-hardhat-ignition-module': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-ethers/ignition/modules/ZeekMessages.ts',
    },
    'compile-hardhat-project': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
    },
    'deploy-hardhat-contract': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
    },
  },
  'zksync-network/quick-start/interact-with-your-contract': {
    'select-local-node-interact': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'select-hardhat-ethers-interact': {
      action: 'clickButtonByText',
      buttonText: 'Hardhat with ethers',
    },
    'create-hardhat-ethers-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
      useSetCommand: 'touch scripts/interact.ts',
    },
    'add-hardhat-ethers-script': {
      action: 'writeToFile',
      filepath: 'tests-output/hardhat-example-ethers/scripts/interact.ts',
    },
    'create-hh-ethers-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
      useSetCommand: 'touch .env',
    },
    'set-hardhat-ethers-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/hardhat-example-ethers/ignition/deployments/chain-31337/deployed_addresses.json',
      envFilepath: 'tests-output/hardhat-example-ethers/.env',
      variableName: 'CONTRACT_ADDRESS',
      selector: { regex: /(?<="ZeekMessages#ZeekMessages"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'run-hardhat-ethers-script': {
      action: 'runCommand',
      commandFolder: 'tests-output/hardhat-example-ethers',
      preCommand: 'set -a && . ./.env && set +a && <COMMAND>',
      checkForOutput: 'Last message: Hello from Hardhat',
    },
  },
};

export default steps;

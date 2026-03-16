import type { IPageStepConfig } from '../utils/types';

const steps: IPageStepConfig = {
  'zksync-network/quick-start/deploy-your-first-contract': {
    'select-local-node-deploy': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'create-foundry-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'move-into-foundry-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'create-foundry-contract-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
      useSetCommand: 'touch src/ZeekMessages.sol',
    },
    'add-zeek-messages-contract': {
      action: 'writeToFile',
      filepath: 'tests-output/ZeekMessages/src/ZeekMessages.sol',
    },
    'create-foundry-deploy-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
      useSetCommand: 'touch script/ZeekMessages.s.sol',
    },
    'add-foundry-deploy-script': {
      action: 'writeToFile',
      filepath: 'tests-output/ZeekMessages/script/ZeekMessages.s.sol',
    },
    'build-foundry-project': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
    },
    'deploy-foundry-contract': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
    },
  },
  'zksync-network/quick-start/interact-with-your-contract': {
    'select-local-node-interact': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'create-foundry-interact-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
      useSetCommand: 'touch script/InteractZeekMessages.s.sol',
    },
    'add-foundry-interact-script': {
      action: 'writeToFile',
      filepath: 'tests-output/ZeekMessages/script/InteractZeekMessages.s.sol',
    },
    'create-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
      useSetCommand: 'touch .env',
    },
    'set-foundry-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/ZeekMessages/broadcast/ZeekMessages.s.sol/31337/run-latest.json',
      envFilepath: 'tests-output/ZeekMessages/.env',
      variableName: 'CONTRACT_ADDRESS',
      selector: { regex: /(?<="contractAddress"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'run-foundry-interact-script': {
      action: 'runCommand',
      commandFolder: 'tests-output/ZeekMessages',
      preCommand: 'set -a && source .env && set +a && <COMMAND>',
      checkForOutput: 'Last message: Hello from Foundry',
    },
  },
};

export default steps;

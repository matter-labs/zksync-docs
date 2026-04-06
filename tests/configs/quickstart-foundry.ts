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
    'install-foundry-openzeppelin': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
    },
    'create-remappings': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      useSetCommand: 'touch remappings.txt',
    },
    'modify-remappings': {
      action: 'writeToFile',
      filepath: 'tests-output/QuickstartToken/remappings.txt',
    },
    'create-foundry-contract-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      useSetCommand: 'touch src/QuickstartToken.sol',
    },
    'add-token-contract': {
      action: 'writeToFile',
      filepath: 'tests-output/QuickstartToken/src/QuickstartToken.sol',
    },
    'create-foundry-deploy-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      useSetCommand: 'touch script/QuickstartToken.s.sol',
    },
    'add-foundry-deploy-script': {
      action: 'writeToFile',
      filepath: 'tests-output/QuickstartToken/script/QuickstartToken.s.sol',
    },
    'build-foundry-project': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
    },
    'deploy-foundry-contract': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
    },
  },
  'zksync-network/quick-start/interact-with-your-contract': {
    'select-local-node-interact': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'create-foundry-interact-script-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      useSetCommand: 'touch script/InteractQuickstartToken.s.sol',
    },
    'add-foundry-interact-script': {
      action: 'writeToFile',
      filepath: 'tests-output/QuickstartToken/script/InteractQuickstartToken.s.sol',
    },
    'create-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      useSetCommand: 'touch .env',
    },
    'set-foundry-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/QuickstartToken/broadcast/QuickstartToken.s.sol/31337/run-latest.json',
      envFilepath: 'tests-output/QuickstartToken/.env',
      variableName: 'CONTRACT_ADDRESS',
      selector: { regex: /(?<="contractAddress"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'run-foundry-interact-script': {
      action: 'runCommand',
      commandFolder: 'tests-output/QuickstartToken',
      preCommand: 'set -a && . ./.env && set +a && <COMMAND>',
      checkForOutput: 'Recipient balance increase: 10',
    },
  },
};

export default steps;

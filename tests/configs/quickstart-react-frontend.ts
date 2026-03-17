import type { IPageStepConfig } from '../utils/types';

const steps: IPageStepConfig = {
  'zksync-network/quick-start/build-a-frontend': {
    'select-local-node-frontend': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'create-react-frontend-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'move-into-react-frontend-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'install-react-frontend-deps': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend',
    },
    'create-react-wagmi-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend',
      useSetCommand: 'touch src/wagmi.ts',
    },
    'add-react-wagmi-config': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend/src/wagmi.ts',
    },
    'configure-react-main-file': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend/src/main.tsx',
    },
    'open-app-tsx': {
      action: 'clickButtonByText',
      buttonText: 'App.tsx',
    },
    'replace-react-app-file': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend/src/App.tsx',
    },
    'create-react-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend',
      useSetCommand: 'touch .env',
    },
    'set-react-frontend-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/hardhat-example-viem/ignition/deployments/chain-31337/deployed_addresses.json',
      envFilepath: 'tests-output/zeek-frontend/.env',
      variableName: 'VITE_CONTRACT_ADDRESS',
      selector: { regex: /(?<="ZeekMessages#ZeekMessages"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'set-react-frontend-chain': {
      action: 'modifyFile',
      filepath: 'tests-output/zeek-frontend/.env',
      atLine: 2,
      useSetData: 'VITE_CHAIN=local',
    },
    'run-react-frontend': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend',
      preCommand: "bun pm2 start '<COMMAND>' --name quickstart-react",
      waitTime: 10000,
    },
    'open-frontend-preview': {
      action: 'visitURL',
      url: 'http://localhost:5173',
    },
    'check-frontend-title': {
      action: 'findText',
      text: 'Zeek Messages',
    },
    'check-frontend-total-messages': {
      action: 'findText',
      text: 'Total messages',
    },
    'check-frontend-last-message': {
      action: 'findText',
      text: 'Last message',
    },
  },
};

export default steps;

import type { IPageStepConfig } from '../utils/types';

const steps: IPageStepConfig = {
  'zksync-network/quick-start/build-a-frontend': {
    'select-local-node-frontend': {
      action: 'clickButtonByText',
      buttonText: 'Local Node',
    },
    'select-vue-frontend': {
      action: 'clickButtonByText',
      buttonText: 'Vue',
    },
    'create-vue-frontend-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'move-into-vue-frontend-project': {
      action: 'runCommand',
      commandFolder: 'tests-output',
    },
    'install-vue-frontend-deps': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend-vue',
    },
    'create-vue-wagmi-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend-vue',
      useSetCommand: 'touch src/wagmi.ts',
    },
    'add-vue-wagmi-config': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend-vue/src/wagmi.ts',
    },
    'configure-vue-main-file': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend-vue/src/main.ts',
    },
    'open-app-vue': {
      action: 'clickButtonByText',
      buttonText: 'App.vue',
    },
    'replace-vue-app-file': {
      action: 'writeToFile',
      filepath: 'tests-output/zeek-frontend-vue/src/App.vue',
    },
    'create-vue-env-file': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend-vue',
      useSetCommand: 'touch .env',
    },
    'set-vue-frontend-contract-address': {
      action: 'extractDataToEnv',
      dataFilepath: 'tests-output/hardhat-example-viem/ignition/deployments/chain-31337/deployed_addresses.json',
      envFilepath: 'tests-output/zeek-frontend-vue/.env',
      variableName: 'VITE_CONTRACT_ADDRESS',
      selector: { regex: /(?<="ZeekMessages#ZeekMessages"\s*:\s*")0x[a-fA-F0-9]{40}(?=")/ },
    },
    'set-vue-frontend-chain': {
      action: 'modifyFile',
      filepath: 'tests-output/zeek-frontend-vue/.env',
      atLine: 2,
      useSetData: 'VITE_CHAIN=local',
    },
    'run-vue-frontend': {
      action: 'runCommand',
      commandFolder: 'tests-output/zeek-frontend-vue',
      preCommand: "bun pm2 start '<COMMAND> -- --port 5174' --name quickstart-vue",
      waitTime: 10000,
    },
    'open-frontend-preview': {
      action: 'visitURL',
      url: 'http://localhost:5174',
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

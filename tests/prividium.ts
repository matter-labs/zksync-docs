import type { IStepConfig } from './utils/types';

const steps: IStepConfig = {
  'project-folder': {
    action: 'runCommand',
    useSetCommand: 'rm -rf prividium && mkdir prividium',
  },
  'create-ecosystem': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium',
    useSetCommand: `zkstack ecosystem create --ecosystem-name my_elastic_network --l1-network localhost --chain-name prividium_chain --chain-id 548394 --prover-mode no-proofs --wallet-creation localhost --l1-batch-commit-data-generator-mode validium --evm-emulator false --base-token-address 0x0000000000000000000000000000000000000001 --start-containers true --base-token-price-nominator 1 --base-token-price-denominator 1`,
    prompts: 'Clone for me:',
    waitTime: 6 * 60 * 1000,
  },
  'move-to-ecosystem-folder': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium',
  },
  'add-tsconfig': {
    action: 'writeToFile',
    filepath: 'tests-output/tsconfig.json',
    useSetData: `{
    "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    }
  }
  `,
  },
  'init-ecosystem': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    waitTime: 30 * 60 * 1000,
  },
  'start-server': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    preCommand: "bun pm2 start '<COMMAND>' --name prividium_server",
    waitTime: 30000,
  },
  'deposit-eth': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    prompts:
      'Amount to deposit:9|Private key of the sender:0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110|Recipient address on L2:',
  },
  'check-balance': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
  },
  'create-test-project': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium',
    prompts: 'Private key of the wallet responsible:',
  },
  'npm-install': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/prividium-token',
    useSetCommand: 'npm install',
  },
  'add-pk': {
    action: 'writeToFile',
    filepath: 'tests-output/prividium/prividium-token/.env',
    useSetData: `WALLET_PRIVATE_KEY=0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110`,
  },
  'change-network': {
    action: 'modifyFile',
    filepath: 'tests-output/prividium/prividium-token/hardhat.config.ts',
    atLine: 10,
    removeLines: [10],
  },
  'compile-and-deploy': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/prividium-token',
    saveOutput: 'tests-output/prividium/prividium-token/deployments.txt',
  },
  'init-proxy': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
  },
  'run-proxy': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    preCommand: "bun pm2 start '<COMMAND>' --name prividium_proxy",
    waitTime: 30000,
  },
  'open-permissions': {
    action: 'clickButtonByText',
    buttonText: 'private-rpc-permissions.yaml',
  },
  'update-permissions': {
    action: 'writeToFile',
    filepath: 'tests-output/prividium/my_elastic_network/chains/prividium_chain/configs/private-rpc-permissions.yaml',
  },
  'make-env-file': {
    action: 'runCommand',
    useSetCommand: 'touch .env',
    commandFolder: '.',
  },
  'extract-contract-id': {
    action: 'extractDataToEnv',
    dataFilepath: 'tests-output/prividium/prividium-token/deployments.txt',
    envFilepath: '.env',
    variableName: 'PRIVIDIUM_TOKEN_ADDRESS',
    selector: { regex: /Contract ID: (0x[a-fA-F0-9]{40})/ },
  },
  'update-token-address': {
    action: 'modifyFile',
    filepath: 'tests-output/prividium/my_elastic_network/chains/prividium_chain/configs/private-rpc-permissions.yaml',
    atLine: 7,
    removeLines: [7],
    useSetData: `  - address: '${process.env.PRIVIDIUM_TOKEN_ADDRESS}'`,
  },
  'restart-proxy': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    useSetCommand: 'bun pm2 restart prividium_proxy',
    waitTime: 5000,
  },
  'open-interact': {
    action: 'clickButtonByText',
    buttonText: 'scripts/priv-interact.ts',
  },
  'interact-script': {
    action: 'writeToFile',
    filepath: 'tests-output/prividium/prividium-token/scripts/priv-interact.ts',
  },
  'get-token-address': {
    action: 'extractDataToEnv',
    dataFilepath: 'tests-output/prividium/prividium-token/deployments.txt',
    envFilepath: 'tests-output/prividium/prividium-token/.env',
    variableName: 'CONTRACT_ADDRESS',
    selector: { regex: /Contract ID: (0x[a-fA-F0-9]{40})/ },
  },
  'add-recipient': {
    action: 'modifyFile',
    filepath: 'tests-output/prividium/prividium-token/.env',
    useSetData: 'RECIPIENT_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  },
  'run-interact': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/prividium-token',
    checkForOutput: '✅ Transferred',
    saveOutput: 'tests-output/prividium/prividium-token/interact-output.txt',
  },
  'open-balance': {
    action: 'clickButtonByText',
    buttonText: 'scripts/check-balance.ts',
  },
  'check-priv-balance': {
    action: 'writeToFile',
    filepath: 'tests-output/prividium/prividium-token/scripts/check-balance.ts',
  },
  'get-user-token': {
    action: 'extractDataToEnv',
    dataFilepath: 'tests-output/prividium/prividium-token/interact-output.txt',
    envFilepath: 'tests-output/prividium/prividium-token/.env',
    variableName: 'USER_TOKEN',
    selector: { regex: /(?<=Deloyer user token:\s*)[A-Za-z0-9]+/ },
  },
  'check-user-balance': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/prividium-token',
    checkForOutput: 'token balance: 999999.0',
  },
  'init-verifier': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    waitTime: 15000,
  },
  'run-verifier': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    preCommand: "bun pm2 start '<COMMAND>' --name prividium_verifier",
    waitTime: 15000,
  },
  'init-explorer': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    prompts: 'database url:|database name:|max age:|same site:|',
  },
  'explorer-backend': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    preCommand: "bun pm2 start '<COMMAND>' --name prividium_explorer_backend",
    waitTime: 5000,
  },
  'explorer-frontend': {
    action: 'runCommand',
    commandFolder: 'tests-output/prividium/my_elastic_network',
    preCommand: "bun pm2 start '<COMMAND>' --name prividium_explorer_frontend",
    waitTime: 5000,
  },
};

export default steps;

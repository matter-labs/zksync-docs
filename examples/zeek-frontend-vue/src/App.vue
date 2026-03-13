<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from '@wagmi/vue';
import { numberToHex, type Abi, type Address } from 'viem';
import { activeChain } from './wagmi';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as Address;

const abi = [
  {
    type: 'function',
    name: 'sendMessage',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_message', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getTotalMessages',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getLastMessage',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const satisfies Abi;

function getRpcErrorCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;

  if ('code' in error && typeof error.code === 'number') {
    return error.code;
  }

  if ('cause' in error) {
    return getRpcErrorCode(error.cause);
  }

  return undefined;
}

const message = ref('Hello from local Vue');
const needsChainAdded = ref(false);

const connect = useConnect();
const { address, chainId, connector, isConnected } = useConnection();
const connectors = useConnectors();
const disconnect = useDisconnect();
const switchChain = useSwitchChain();
const writeContract = useWriteContract();
const txResult = useWaitForTransactionReceipt({
  hash: computed(() => writeContract.data.value),
});

const visibleConnectors = computed(() => connectors.value.filter((connector) => connector.id !== 'injected'));
const isWrongChain = computed(() => isConnected.value && chainId.value !== activeChain.id);
const shouldShowAddChain = computed(() => needsChainAdded.value || getRpcErrorCode(switchChain.error.value) === 4902);

const { data: totalMessages, refetch: refetchTotalMessages } = useReadContract({
  address: contractAddress,
  abi,
  functionName: 'getTotalMessages',
});

const {
  data: lastMessage,
  refetch: refetchLastMessage,
  error: lastMessageError,
} = useReadContract({
  address: contractAddress,
  abi,
  functionName: 'getLastMessage',
});

async function sendMessage() {
  writeContract.mutate(
    {
      address: contractAddress,
      abi,
      functionName: 'sendMessage',
      args: [message.value],
      account: address.value,
      chain: activeChain,
    },
    {
      onSuccess: async () => {
        await refetchTotalMessages();
        await refetchLastMessage();
      },
    }
  );
}

async function requestSwitchChain() {
  try {
    await switchChain.mutateAsync({ chainId: activeChain.id });
    needsChainAdded.value = false;
  } catch (error) {
    if (getRpcErrorCode(error) === 4902) {
      needsChainAdded.value = true;
    }
  }
}

async function requestAddChain() {
  const provider = await connector.value?.getProvider({
    chainId: activeChain.id,
  });

  if (!provider) return;

  await (
    provider as {
      request(args: {
        method: 'wallet_addEthereumChain';
        params: [
          {
            chainId: `0x${string}`;
            chainName: string;
            nativeCurrency: typeof activeChain.nativeCurrency;
            rpcUrls: readonly string[];
            blockExplorerUrls?: string[] | undefined;
          },
        ];
      }): Promise<unknown>;
    }
  ).request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: numberToHex(activeChain.id),
        chainName: activeChain.name,
        nativeCurrency: activeChain.nativeCurrency,
        rpcUrls: activeChain.rpcUrls.default.http,
        blockExplorerUrls: activeChain.blockExplorers
          ? Object.values(activeChain.blockExplorers).map((explorer) => (explorer as { url: string }).url)
          : undefined,
      },
    ],
  });

  needsChainAdded.value = false;
  await requestSwitchChain();
}
</script>

<template>
  <main class="page">
    <section class="card">
      <div class="header">
        <div>
          <p class="eyebrow">Vue + wagmi example</p>
          <h1 class="title">Zeek Messages</h1>
          <p class="subtitle">Send a message to the demo contract on {{ activeChain.name }}.</p>
        </div>
        <div class="chain-badge">{{ activeChain.name }}</div>
      </div>

      <div class="status-row">
        <div class="status-block">
          <span class="status-label">Wallet</span>
          <span class="status-value">
            {{ isConnected ? address : 'Not connected' }}
          </span>
        </div>

        <button
          v-if="isConnected"
          class="secondary-button"
          @click="disconnect.mutate()"
        >
          Disconnect wallet
        </button>

        <div
          v-else
          class="button-group"
        >
          <button
            v-for="connector in visibleConnectors"
            :key="connector.uid"
            class="primary-button"
            :disabled="connect.isPending.value"
            @click="connect.mutate({ connector })"
          >
            Connect {{ connector.name }}
          </button>
        </div>
      </div>

      <div
        v-if="!isConnected"
        class="notice-card"
      >
        <p class="notice-title">Connect your wallet to send a message</p>
        <p class="notice-text">Choose a wallet above to enable the form and submit transactions.</p>
      </div>

      <div
        v-else-if="isWrongChain"
        class="notice-card"
      >
        <p class="notice-title">Wallet is on the wrong network</p>
        <p class="notice-text">Switch to {{ activeChain.name }} to send messages from this page.</p>

        <button
          v-if="shouldShowAddChain"
          class="primary-button"
          @click="requestAddChain"
        >
          Add {{ activeChain.name }}
        </button>

        <button
          v-else
          class="primary-button"
          :disabled="switchChain.isPending.value"
          @click="requestSwitchChain"
        >
          Switch to {{ activeChain.name }}
        </button>
      </div>

      <div
        v-else
        class="form-card"
      >
        <label
          class="label"
          for="message"
          >Message</label
        >
        <input
          id="message"
          v-model="message"
          class="input"
        />

        <button
          class="primary-button"
          :disabled="
            !isConnected || writeContract.isPending.value || (writeContract.data.value && txResult.isPending.value)
          "
          @click="sendMessage"
        >
          Send message
        </button>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Total messages</span>
          <strong class="metric-value">{{ totalMessages?.toString() ?? '0' }}</strong>
        </div>

        <div class="metric-card">
          <span class="metric-label">Last message</span>
          <strong class="metric-value">
            {{
              typeof lastMessage === 'string' ? lastMessage : lastMessageError ? 'Send a message first.' : 'Loading...'
            }}
          </strong>
        </div>
      </div>

      <div
        v-if="txResult.isError.value"
        class="error-banner"
      >
        Error sending message.
      </div>
    </section>
  </main>
</template>

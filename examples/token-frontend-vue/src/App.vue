<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
import { erc20Abi, formatUnits, isAddress, numberToHex, parseUnits, zeroAddress, type Address } from 'viem';
import { activeChain } from './wagmi';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS as Address;
const ONE_TOKEN = parseUnits('1', 18);

type Banner = {
  tone: 'success' | 'error';
  message: string;
};

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

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'Transfer failed. Check the recipient address, amount, and wallet state.';
}

function formatTokenAmount(value: bigint | undefined) {
  return value === undefined ? 'Loading...' : formatUnits(value, 18);
}

function getDefaultTransferAmount(balance: bigint) {
  return balance >= ONE_TOKEN ? '1' : '0';
}

function clampTransferAmountInput(value: string, balance: bigint | undefined) {
  if (value === '') return '';
  if (!/^\d*(?:\.\d{0,18})?$/.test(value)) return null;
  if (balance === undefined) return value;

  const maxAmount = formatUnits(balance, 18);
  const normalizedValue = value.endsWith('.') ? value.slice(0, -1) : value;
  if (normalizedValue === '') return value;

  try {
    const parsedValue = parseUnits(normalizedValue, 18);
    return parsedValue >= balance ? maxAmount : value;
  } catch {
    return null;
  }
}

const needsChainAdded = ref(false);
const recipientAddress = ref('');
const transferAmount = ref('0');
const banner = ref<Banner | null>(null);
const hasInitializedTransferAmount = ref(false);

const connect = useConnect();
const { address, chainId, connector, isConnected } = useConnection();
const connectors = useConnectors();
const disconnect = useDisconnect();
const switchChain = useSwitchChain();
const writeContract = useWriteContract();
const txResult = useWaitForTransactionReceipt({
  hash: computed(() => writeContract.data.value),
});

const visibleConnectors = computed(() =>
  connectors.value.filter((walletConnector) => walletConnector.id !== 'injected')
);
const isWrongChain = computed(() => isConnected.value && chainId.value !== activeChain.id);
const shouldShowAddChain = computed(() => needsChainAdded.value || getRpcErrorCode(switchChain.error.value) === 4902);
const isTransferPending = computed(
  () => Boolean(writeContract.data.value) && (writeContract.isPending.value || txResult.isPending.value)
);

const { data: tokenName } = useReadContract({
  address: contractAddress,
  abi: erc20Abi,
  functionName: 'name',
});

const { data: tokenSymbol } = useReadContract({
  address: contractAddress,
  abi: erc20Abi,
  functionName: 'symbol',
});

const { data: totalSupply } = useReadContract({
  address: contractAddress,
  abi: erc20Abi,
  functionName: 'totalSupply',
});

const { data: walletBalance, refetch: refetchWalletBalance } = useReadContract({
  address: contractAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: computed<readonly [Address]>(() => [address.value ?? zeroAddress]),
});
const normalizedWalletBalance = computed(() =>
  typeof walletBalance.value === 'bigint' ? walletBalance.value : undefined
);

watch(
  () => normalizedWalletBalance.value,
  (balance) => {
    if (balance === undefined) return;

    if (!hasInitializedTransferAmount.value) {
      transferAmount.value = getDefaultTransferAmount(balance);
      hasInitializedTransferAmount.value = true;
      return;
    }

    transferAmount.value = clampTransferAmountInput(transferAmount.value, balance) ?? getDefaultTransferAmount(balance);
  }
);

watch(
  () => txResult.isSuccess.value,
  async (isSuccess) => {
    if (!isSuccess || !writeContract.data.value) return;

    await refetchWalletBalance();
    banner.value = {
      tone: 'success',
      message: `Transfer confirmed: ${writeContract.data.value}`,
    };
  }
);

watch(
  () => txResult.isError.value,
  (isError) => {
    if (!isError) return;

    banner.value = {
      tone: 'error',
      message: 'Transfer transaction failed after submission.',
    };
  }
);

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

function submitTransfer() {
  if (!address.value) {
    banner.value = { tone: 'error', message: 'Connect your wallet before sending tokens.' };
    return;
  }

  if (!isAddress(recipientAddress.value)) {
    banner.value = { tone: 'error', message: 'Enter a valid recipient address.' };
    return;
  }

  let parsedAmount: bigint;
  try {
    parsedAmount = parseUnits(transferAmount.value, 18);
  } catch {
    banner.value = { tone: 'error', message: 'Enter a valid token amount.' };
    return;
  }

  if (parsedAmount <= 0n) {
    banner.value = { tone: 'error', message: 'Transfer amount must be greater than zero.' };
    return;
  }

  if (normalizedWalletBalance.value !== undefined && parsedAmount > normalizedWalletBalance.value) {
    banner.value = { tone: 'error', message: 'Transfer amount cannot exceed your balance.' };
    return;
  }

  banner.value = null;
  writeContract.mutate(
    {
      address: contractAddress,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipientAddress.value, parsedAmount],
      account: address.value,
      chain: activeChain,
    },
    {
      onError: (error) => {
        banner.value = {
          tone: 'error',
          message: getErrorMessage(error),
        };
      },
    }
  );
}

function updateTransferAmount(event: Event) {
  const input = event.target as HTMLInputElement;
  const nextAmount = clampTransferAmountInput(input.value, normalizedWalletBalance.value);
  if (nextAmount !== null) {
    if (nextAmount !== input.value) {
      input.value = nextAmount;
    }
    transferAmount.value = nextAmount;
  }
}
</script>

<template>
  <main class="page">
    <section class="card">
      <div class="header">
        <div>
          <p class="eyebrow">Vue + wagmi example</p>
          <h1 class="title">Quickstart Token</h1>
          <p class="subtitle">Read ERC-20 token data from your deployed contract on {{ activeChain.name }}.</p>
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
            v-for="walletConnector in visibleConnectors"
            :key="walletConnector.uid"
            class="primary-button"
            :disabled="connect.isPending.value"
            @click="connect.mutate({ connector: walletConnector })"
          >
            Connect {{ walletConnector.name }}
          </button>
        </div>
      </div>

      <div
        v-if="!isConnected"
        class="notice-card"
      >
        <p class="notice-title">Connect your wallet to transfer tokens</p>
      </div>

      <div
        v-else-if="isWrongChain"
        class="notice-card"
      >
        <p class="notice-title">Wallet is on the wrong network</p>
        <p class="notice-text">Switch to {{ activeChain.name }} to transfer tokens from this page.</p>

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
        <p class="notice-title">Transfer tokens</p>
        <p class="notice-text">Send QKT token to another address and watch the status update below.</p>

        <label
          class="label"
          for="recipient-address"
          >Recipient address</label
        >
        <input
          id="recipient-address"
          v-model="recipientAddress"
          class="input"
          placeholder="0x..."
        />

        <label
          class="label"
          for="transfer-amount"
          >Amount</label
        >
        <input
          id="transfer-amount"
          :value="transferAmount"
          class="input"
          placeholder="10"
          @input="updateTransferAmount"
        />

        <button
          :class="isTransferPending ? 'disabled-button' : 'primary-button'"
          :disabled="isTransferPending"
          @click="submitTransfer"
        >
          {{ isTransferPending ? 'Submitting transfer...' : 'Send tokens' }}
        </button>
      </div>

      <div
        v-if="banner"
        class="banner"
        :class="banner.tone === 'success' ? 'banner-success' : 'banner-error'"
      >
        {{ banner.message }}
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Token name</span>
          <strong class="metric-value">{{ tokenName ?? 'Loading...' }}</strong>
        </div>

        <div class="metric-card">
          <span class="metric-label">Token symbol</span>
          <strong class="metric-value">{{ tokenSymbol ?? 'Loading...' }}</strong>
        </div>

        <div class="metric-card">
          <span class="metric-label">Total supply</span>
          <strong class="metric-value">{{ formatTokenAmount(totalSupply) }}</strong>
        </div>

        <div class="metric-card">
          <span class="metric-label">Your balance</span>
          <strong class="metric-value">
            {{
              isConnected
                ? normalizedWalletBalance !== undefined
                  ? formatTokenAmount(normalizedWalletBalance)
                  : '-'
                : 'Connect wallet'
            }}
          </strong>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
:root {
  font-family: ui-sans-serif, system-ui, sans-serif;
  color: #e5eefb;
  background: radial-gradient(circle at top, rgba(34, 197, 94, 0.18), transparent 32%),
    linear-gradient(180deg, #08111f 0%, #111c2d 100%);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

#app {
  min-height: 100vh;
}

.page {
  min-height: 100vh;
  padding: 32px 16px;
}

.card {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 24px;
  background: rgba(10, 18, 31, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.eyebrow {
  margin: 0;
  color: #7dd3fc;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.title {
  margin: 8px 0 6px;
  font-size: clamp(2rem, 5vw, 2.4rem);
  line-height: 1.05;
}

.subtitle {
  margin: 0;
  color: #94a3b8;
  max-width: 52ch;
}

.chain-badge {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.12);
  border: 1px solid rgba(125, 211, 252, 0.28);
  color: #dbeafe;
  font-size: 0.92rem;
  white-space: nowrap;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.7);
  flex-wrap: wrap;
}

.status-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.status-label,
.metric-label {
  color: #94a3b8;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.status-value {
  color: #f8fafc;
  font-size: 0.95rem;
  word-break: break-all;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-button,
.disabled-button,
.secondary-button {
  padding: 12px 18px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  border: 0;
  background: linear-gradient(135deg, #38bdf8 0%, #22c55e 100%);
  color: #04111d;
}

.disabled-button {
  border: 0;
  background: gray;
  color: #ffffff;
  cursor: not-allowed;
}

.secondary-button {
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
}

.notice-card,
.form-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 18px;
  border-radius: 18px;
}

.notice-card {
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(96, 165, 250, 0.24);
}

.form-card {
  background: rgba(15, 23, 42, 0.72);
}

.notice-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.notice-text {
  margin: 0;
  color: #cbd5e1;
}

.label {
  font-size: 0.92rem;
  color: #cbd5e1;
  font-weight: 600;
}

.input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(8, 17, 31, 0.9);
  color: #f8fafc;
}

.banner {
  margin-bottom: 24px;
  padding: 16px 18px;
  border-radius: 16px;
  font-weight: 600;
}

.banner-success {
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #bbf7d0;
}

.banner-error {
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #fecaca;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.metric-value {
  color: #f8fafc;
  font-size: 1rem;
  line-height: 1.5;
  word-break: break-word;
}

@media (max-width: 640px) {
  .card {
    padding: 22px;
  }

  .status-row {
    align-items: stretch;
  }

  .button-group,
  .primary-button,
  .disabled-button,
  .secondary-button {
    width: 100%;
  }
}
</style>

import { useState, type CSSProperties } from 'react';
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
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

export default function App() {
  const [message, setMessage] = useState('Hello from local React');
  const [needsChainAdded, setNeedsChainAdded] = useState(false);
  const connect = useConnect();
  const connection = useConnection();
  const connectors = useConnectors();
  const visibleConnectors = connectors.filter((connector) => connector.id !== 'injected');
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const walletClient = useWalletClient();
  const writeContract = useWriteContract();
  const txResult = useWaitForTransactionReceipt({ hash: writeContract.data });

  const isWrongChain = connection.isConnected && connection.chainId !== activeChain.id;
  const shouldShowAddChain = needsChainAdded || getRpcErrorCode(switchChain.error) === 4902;

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

  const sendMessage = async () => {
    writeContract.mutate(
      {
        address: contractAddress,
        abi,
        functionName: 'sendMessage',
        args: [message],
        account: connection.address,
        chain: activeChain,
      },
      {
        onSuccess: async () => {
          await refetchTotalMessages();
          await refetchLastMessage();
        },
      }
    );
  };

  const requestSwitchChain = async () => {
    try {
      await switchChain.mutateAsync({ chainId: activeChain.id });
      setNeedsChainAdded(false);
    } catch (error) {
      const code = getRpcErrorCode(error);

      if (code === 4902) {
        setNeedsChainAdded(true);
      }
    }
  };

  const requestAddChain = async () => {
    if (!walletClient.data) return;

    await walletClient.data.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: numberToHex(activeChain.id),
          chainName: activeChain.name,
          nativeCurrency: activeChain.nativeCurrency,
          rpcUrls: activeChain.rpcUrls.default.http,
          blockExplorerUrls: activeChain.blockExplorers
            ? Object.values(activeChain.blockExplorers).map(({ url }) => url)
            : undefined,
        },
      ],
    });
    setNeedsChainAdded(false);
    await requestSwitchChain();
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>React + wagmi example</p>
            <h1 style={styles.title}>Zeek Messages</h1>
            <p style={styles.subtitle}>Send a message to the demo contract on {activeChain.name}.</p>
          </div>
          <div style={styles.chainBadge}>{activeChain.name}</div>
        </div>

        <div style={styles.statusRow}>
          <div style={styles.statusBlock}>
            <span style={styles.statusLabel}>Wallet</span>
            <span style={styles.statusValue}>{connection.isConnected ? connection.address : 'Not connected'}</span>
          </div>

          {connection.isConnected ? (
            <button
              style={styles.secondaryButton}
              onClick={() => disconnect.mutate()}
            >
              Disconnect wallet
            </button>
          ) : (
            <div style={styles.buttonGroup}>
              {visibleConnectors.map((connector) => (
                <button
                  key={connector.uid}
                  style={styles.primaryButton}
                  onClick={() => connect.mutate({ connector })}
                  disabled={connection.isConnecting}
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {!connection.isConnected ? (
          <div style={styles.noticeCard}>
            <p style={styles.noticeTitle}>Connect your wallet to send a message</p>
            <p style={styles.noticeText}>Choose a wallet above to enable the form and submit transactions.</p>
          </div>
        ) : isWrongChain ? (
          <div style={styles.noticeCard}>
            <p style={styles.noticeTitle}>Wallet is on the wrong network</p>
            <p style={styles.noticeText}>Switch to {activeChain.name} to send messages from this page.</p>
            {shouldShowAddChain ? (
              <button
                style={styles.primaryButton}
                onClick={requestAddChain}
                disabled={walletClient.isLoading || walletClient.isFetching}
              >
                Add {activeChain.name}
              </button>
            ) : (
              <button
                style={styles.primaryButton}
                onClick={requestSwitchChain}
                disabled={switchChain.isPending}
              >
                Switch to {activeChain.name}
              </button>
            )}
          </div>
        ) : (
          <div style={styles.formCard}>
            <label
              htmlFor="message"
              style={styles.label}
            >
              Message
            </label>
            <input
              id="message"
              style={styles.input}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />

            <button
              style={styles.primaryButton}
              onClick={sendMessage}
              disabled={
                !connection.isConnected || writeContract.isPending || (writeContract.data && txResult.isPending)
              }
            >
              Send message
            </button>
          </div>
        )}

        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Total messages</span>
            <strong style={styles.metricValue}>{totalMessages?.toString() ?? '0'}</strong>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Last message</span>
            <strong style={styles.metricValue}>
              {typeof lastMessage === 'string'
                ? lastMessage
                : lastMessageError
                  ? 'Send a message first.'
                  : 'Loading...'}
            </strong>
          </div>
        </div>

        {txResult.isError ? <div style={styles.errorBanner}>Error sending message.</div> : null}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '32px 16px',
    background:
      'radial-gradient(circle at top, rgba(34, 197, 94, 0.18), transparent 32%), linear-gradient(180deg, #08111f 0%, #111c2d 100%)',
    color: '#e5eefb',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  },
  card: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '28px',
    borderRadius: '24px',
    background: 'rgba(10, 18, 31, 0.92)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  eyebrow: {
    margin: 0,
    color: '#7dd3fc',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  title: {
    margin: '8px 0 6px',
    fontSize: '2.4rem',
    lineHeight: 1.05,
  },
  subtitle: {
    margin: 0,
    color: '#94a3b8',
    maxWidth: '52ch',
  },
  chainBadge: {
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'rgba(125, 211, 252, 0.12)',
    border: '1px solid rgba(125, 211, 252, 0.28)',
    color: '#dbeafe',
    fontSize: '0.92rem',
    whiteSpace: 'nowrap',
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(15, 23, 42, 0.7)',
    flexWrap: 'wrap',
  },
  statusBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  statusLabel: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  statusValue: {
    color: '#f8fafc',
    fontSize: '0.95rem',
    wordBreak: 'break-all',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '12px 18px',
    border: 0,
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #38bdf8 0%, #22c55e 100%)',
    color: '#04111d',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '12px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    background: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
    fontWeight: 600,
    cursor: 'pointer',
  },
  noticeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '20px',
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(59, 130, 246, 0.12)',
    border: '1px solid rgba(96, 165, 250, 0.24)',
  },
  noticeTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
  },
  noticeText: {
    margin: 0,
    color: '#cbd5e1',
  },
  formCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(15, 23, 42, 0.72)',
  },
  label: {
    fontSize: '0.92rem',
    color: '#cbd5e1',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    background: 'rgba(8, 17, 31, 0.9)',
    color: '#f8fafc',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '14px',
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(15, 23, 42, 0.76)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: '1rem',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  errorBanner: {
    marginTop: '18px',
    padding: '14px 16px',
    borderRadius: '14px',
    background: 'rgba(239, 68, 68, 0.14)',
    border: '1px solid rgba(248, 113, 113, 0.3)',
    color: '#fecaca',
  },
};

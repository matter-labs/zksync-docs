import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
import { formatUnits, isAddress, numberToHex, parseUnits, zeroAddress, erc20Abi, type Address } from 'viem';
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

export default function App() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('0');
  const [banner, setBanner] = useState<Banner | null>(null);
  const hasInitializedTransferAmount = useRef(false);

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
  const shouldShowAddChain = getRpcErrorCode(switchChain.error) === 4902;

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
    args: [connection.address ?? zeroAddress],
  });

  useEffect(() => {
    if (walletBalance === undefined) return;

    if (!hasInitializedTransferAmount.current) {
      setTransferAmount(getDefaultTransferAmount(walletBalance));
      hasInitializedTransferAmount.current = true;
      return;
    }

    setTransferAmount((currentAmount) => {
      const clampedAmount = clampTransferAmountInput(currentAmount, walletBalance);
      return clampedAmount ?? getDefaultTransferAmount(walletBalance);
    });
  }, [walletBalance]);

  useEffect(() => {
    if (!txResult.isSuccess || !writeContract.data) return;

    void refetchWalletBalance();
    setBanner({
      tone: 'success',
      message: `Transfer confirmed: ${writeContract.data}`,
    });
  }, [refetchWalletBalance, txResult.isSuccess, writeContract.data]);

  useEffect(() => {
    if (!txResult.isError) return;

    setBanner({
      tone: 'error',
      message: 'Transfer transaction failed after submission.',
    });
  }, [txResult.isError]);

  const requestSwitchChain = async () => {
    await switchChain.mutateAsync({ chainId: activeChain.id });
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
    await requestSwitchChain();
  };

  const submitTransfer = () => {
    if (!connection.address) {
      setBanner({ tone: 'error', message: 'Connect your wallet before sending tokens.' });
      return;
    }

    if (!isAddress(recipientAddress)) {
      setBanner({ tone: 'error', message: 'Enter a valid recipient address.' });
      return;
    }

    let parsedAmount: bigint;
    try {
      parsedAmount = parseUnits(transferAmount, 18);
    } catch {
      setBanner({ tone: 'error', message: 'Enter a valid token amount.' });
      return;
    }

    if (parsedAmount <= 0n) {
      setBanner({ tone: 'error', message: 'Transfer amount must be greater than zero.' });
      return;
    }

    if (walletBalance !== undefined && parsedAmount > walletBalance) {
      setBanner({ tone: 'error', message: 'Transfer amount cannot exceed your balance.' });
      return;
    }

    setBanner(null);
    writeContract.mutate(
      {
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress, parsedAmount],
        account: connection.address,
        chain: activeChain,
      },
      {
        onError: (error) => {
          setBanner({
            tone: 'error',
            message: getErrorMessage(error),
          });
        },
      }
    );
  };

  const isTransferPending = writeContract.data && (writeContract.isPending || txResult.isPending);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>React + wagmi example</p>
            <h1 style={styles.title}>Quickstart Token</h1>
            <p style={styles.subtitle}>Read ERC-20 token data from your deployed contract on {activeChain.name}.</p>
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
            <p style={styles.noticeTitle}>Connect your wallet to transfer tokens</p>
            <p style={styles.noticeText}>
              The app shows the ERC-20 metadata immediately and enables the transfer form after you connect.
            </p>
          </div>
        ) : isWrongChain ? (
          <div style={styles.noticeCard}>
            <p style={styles.noticeTitle}>Wallet is on the wrong network</p>
            <p style={styles.noticeText}>Switch to {activeChain.name} to transfer tokens from this page.</p>
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
            <p style={styles.noticeTitle}>Transfer tokens</p>
            <p style={styles.noticeText}>Send QKT token to another address and watch the status update below.</p>

            <label
              htmlFor="recipient-address"
              style={styles.label}
            >
              Recipient address
            </label>
            <input
              id="recipient-address"
              style={styles.input}
              value={recipientAddress}
              onChange={(event) => setRecipientAddress(event.target.value)}
              placeholder="0x..."
            />

            <label
              htmlFor="transfer-amount"
              style={styles.label}
            >
              Amount
            </label>
            <input
              id="transfer-amount"
              style={styles.input}
              value={transferAmount}
              onChange={(event) => {
                const nextAmount = clampTransferAmountInput(event.target.value, walletBalance);
                if (nextAmount !== null) {
                  if (nextAmount !== event.target.value) {
                    event.target.value = nextAmount;
                  }
                  setTransferAmount(nextAmount);
                }
              }}
              placeholder="10"
            />

            <button
              style={isTransferPending ? styles.disabledButton : styles.primaryButton}
              onClick={submitTransfer}
              disabled={isTransferPending}
            >
              {isTransferPending ? 'Submitting transfer...' : 'Send tokens'}
            </button>
          </div>
        )}

        {banner ? (
          <div
            style={{
              ...styles.banner,
              ...(banner.tone === 'success' ? styles.successBanner : styles.errorBanner),
            }}
          >
            {banner.message}
          </div>
        ) : null}

        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Token name</span>
            <strong style={styles.metricValue}>{tokenName ?? 'Loading...'}</strong>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Token symbol</span>
            <strong style={styles.metricValue}>{tokenSymbol ?? 'Loading...'}</strong>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Total supply</span>
            <strong style={styles.metricValue}>{formatTokenAmount(totalSupply)}</strong>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Your balance</span>
            <strong style={styles.metricValue}>
              {connection.isConnected ? formatTokenAmount(walletBalance) : 'Connect wallet'}
            </strong>
          </div>
        </div>
      </section>
    </main>
  );
}

const buttonStyles = {
  border: 0,
  borderRadius: '14px',
  padding: '12px 18px',
  fontWeight: 700,
};

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
    gap: '16px',
    marginBottom: '24px',
  },
  eyebrow: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontSize: '12px',
    color: '#7dd3fc',
  },
  title: {
    margin: '8px 0',
    fontSize: '40px',
    lineHeight: 1,
  },
  subtitle: {
    margin: 0,
    maxWidth: '480px',
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  chainBadge: {
    alignSelf: 'flex-start',
    padding: '10px 14px',
    borderRadius: '999px',
    background: 'rgba(59, 130, 246, 0.18)',
    color: '#bfdbfe',
    fontWeight: 600,
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '18px 20px',
    borderRadius: '20px',
    background: 'rgba(15, 23, 42, 0.8)',
  },
  statusBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  statusLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#94a3b8',
  },
  statusValue: {
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    ...buttonStyles,
    background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
    color: '#08111f',
    cursor: 'pointer',
  },
  disabledButton: {
    ...buttonStyles,
    background: 'gray',
    color: '#ffffff',
    cursor: 'not-allowed',
  },
  secondaryButton: {
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '14px',
    padding: '12px 18px',
    background: 'transparent',
    color: '#e5eefb',
    fontWeight: 600,
    cursor: 'pointer',
  },
  noticeCard: {
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '20px',
    background: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(34, 197, 94, 0.18)',
  },
  formCard: {
    marginBottom: '24px',
    padding: '20px',
    borderRadius: '20px',
    background: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(34, 197, 94, 0.18)',
    display: 'grid',
    gap: '12px',
  },
  label: {
    color: '#cbd5e1',
    fontSize: '14px',
  },
  input: {
    borderRadius: '14px',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    background: 'rgba(8, 17, 31, 0.9)',
    color: '#e5eefb',
    padding: '12px 14px',
    fontSize: '14px',
  },
  noticeTitle: {
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: 700,
  },
  noticeText: {
    margin: 0,
    color: '#cbd5e1',
    lineHeight: 1.5,
  },
  banner: {
    marginBottom: '24px',
    padding: '16px 18px',
    borderRadius: '16px',
    fontWeight: 600,
  },
  successBanner: {
    background: 'rgba(34, 197, 94, 0.14)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    color: '#bbf7d0',
  },
  errorBanner: {
    background: 'rgba(248, 113, 113, 0.14)',
    border: '1px solid rgba(248, 113, 113, 0.3)',
    color: '#fecaca',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  metricCard: {
    padding: '20px',
    borderRadius: '20px',
    background: 'rgba(15, 23, 42, 0.72)',
    border: '1px solid rgba(148, 163, 184, 0.16)',
  },
  metricLabel: {
    display: 'block',
    marginBottom: '12px',
    color: '#94a3b8',
    fontSize: '14px',
  },
  metricValue: {
    fontSize: '28px',
    lineHeight: 1.2,
  },
};

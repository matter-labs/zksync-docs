import { zksyncSsoConnector, callPolicy } from 'zksync-sso/connector';
import { zksyncSepoliaTestnet } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { erc20Abi, parseEther, parseUnits } from 'viem';
import { createAppKit } from '@reown/appkit';

const tokenDecimals = 18; // Adjust based on the token you are working with

const ssoConnector = zksyncSsoConnector({
  // Optional session configuration, if omitted user will have to sign every transaction via Auth Server
  session: {
    expiry: '1 day',

    // Allow up to 0.1 ETH to be spend in gas fees
    feeLimit: parseEther('0.1'),

    transfers: [
      // Allow ETH transfers of up to 0.1 ETH to specific address
      {
        to: '0x188bd99cd7D4d78d4E605Aeea12C17B32CC3135A',
        valueLimit: parseEther('0.1'),
      },
    ],

    // Allow calling specific smart contracts (e.g. ERC20 transfer):
    contractCalls: [
      callPolicy({
        address: '0x45E6dC995113fd3d1A3b1964493105B9AA9a9A42',
        abi: erc20Abi,
        functionName: 'transfer',
        constraints: [
          // Only allow transfers to this address. Or any address if omitted
          {
            index: 0, // First argument of erc20 transfer function, recipient address
            value: '0x6cC8cf7f6b488C58AA909B77E6e65c631c204784',
          },

          // Allow transfering up to 0.2 tokens per hour
          // until the session expires
          {
            index: 1,
            limit: {
              limit: parseUnits('0.2', tokenDecimals),
              period: '1 hour',
            },
          },
        ],
      }),
    ],
  },

  // ************
  // TODO: fix! onSessionStateChange is not a valid field for zksyncSsoConnector
  // ************

  // // Optional: Receive notifications about session state changes
  // onSessionStateChange: ({ state, address, chainId }) => {
  //   console.log(`Session state for address ${address} changed: ${state.type} - ${state.message}`);

  //   // Use this to notify users and restart the session if needed
  //   // - Session expired: state.type === 'session_expired'
  //   // - Session inactive (e.g. was revoked): state.type === 'session_inactive'
  // },
});

const PROJECT_ID = 'YOUR_PROJECT_ID'; // Replace with your Reown project ID

const wagmiAdapter = new WagmiAdapter({
  connectors: [ssoConnector],
  networks: [zksyncSepoliaTestnet],
  projectId: PROJECT_ID,
});

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [zksyncSepoliaTestnet],
  projectId: PROJECT_ID,
  features: {
    analytics: true,
  },
});

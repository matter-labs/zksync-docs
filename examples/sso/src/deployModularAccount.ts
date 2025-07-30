import { createWalletClient, http, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { zksyncSepoliaTestnet } from 'viem/zksync';
import { deployModularAccount } from 'zksync-sso/client';
import type { RegisterNewPasskeyReturnType } from 'zksync-sso/client/passkey';

export async function deployAccountFromPasskey(publicPassKey: RegisterNewPasskeyReturnType) {
  const deployerKey = '0x_YOUR_PRIVATE_KEY'; // Replace with your deployer's private key
  const deployerClient = createWalletClient({
    account: privateKeyToAccount(deployerKey),
    chain: zksyncSepoliaTestnet,
    transport: http(),
  });

  const ssoContracts = {
    accountFactory: '0xd122999B15081d90b175C81B8a4a9bE3327C0c2a' as Address,
    passkey: '0x006ecc2D79242F1986b7cb5F636d6E3f499f1026' as Address,
    session: '0x64Fa4b6fCF655024e6d540E0dFcA4142107D4fBC' as Address,
    recovery: '0x6AA83E35439D71F28273Df396BC7768dbaA9849D' as Address,
  };

  const { address, transactionReceipt } = await deployModularAccount(deployerClient, {
    passkeyModule: {
      location: ssoContracts.passkey,
      credentialPublicKey: publicPassKey.credentialPublicKey,
      credentialId: publicPassKey.credentialId,
    },
    accountFactory: ssoContracts.accountFactory,
    installNoDataModules: [],
    // defines the deployer account as an account owner
    owners: [deployerClient.account.address],
  });

  console.log('Account deployed at:', address);
  console.log('Transaction receipt:', transactionReceipt);
}

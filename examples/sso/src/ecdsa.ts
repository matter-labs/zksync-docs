import type { Address } from 'viem';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { zksyncSepoliaTestnet } from 'viem/chains';
import { createZksyncEcdsaClient } from 'zksync-sso/client/ecdsa';

const privateKey = '0x_YOUR_PRIVATE_KEY'; // Replace with an owner account's private key

const ssoContracts = {
  accountFactory: '0xd122999B15081d90b175C81B8a4a9bE3327C0c2a' as Address,
  passkey: '0x006ecc2D79242F1986b7cb5F636d6E3f499f1026' as Address,
  session: '0x64Fa4b6fCF655024e6d540E0dFcA4142107D4fBC' as Address,
  recovery: '0x6AA83E35439D71F28273Df396BC7768dbaA9849D' as Address,
};

export async function getECDSAClient(accountAddress: Address) {
  const eoaClient = createWalletClient({
    account: privateKeyToAccount(privateKey as Address),
    chain: zksyncSepoliaTestnet,
    transport: http(),
  });

  const ecdsaClient = await createZksyncEcdsaClient({
    address: accountAddress,
    owner: eoaClient.account,
    contracts: ssoContracts,
    chain: zksyncSepoliaTestnet,
    transport: http(),
  });

  console.log(`ECDSA client: ${ecdsaClient}`);
  return ecdsaClient;
}

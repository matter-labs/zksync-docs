import { registerNewPasskey, type RegisterNewPasskeyReturnType } from 'zksync-sso/client/passkey';

export async function registerPasskey() {
  const newPasskey: RegisterNewPasskeyReturnType = await registerNewPasskey({
    userDisplayName: 'Zeek', // Passkey display name
    userName: 'zeek123', // User's unique ID
  });
  console.log('New passkey registered:', newPasskey);
  return newPasskey;
}

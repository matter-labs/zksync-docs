import { connectWithSSO, disconnectWallet } from './wagmi';
import { modal } from './reownAppkit';
import { registerPasskey } from './registerPasskey';
import { deployAccountFromPasskey } from './deployModularAccount';
import type { RegisterNewPasskeyReturnType } from 'zksync-sso/client/passkey';

let registeredPasskey: RegisterNewPasskeyReturnType;

document.getElementById('wagmi-button')!.addEventListener('click', async () => {
  await disconnectWallet();
  await connectWithSSO();
});

document.getElementById('reown-appkit-button')!.addEventListener('click', () => {
  modal.open();
});

document.getElementById('register-passkey')!.addEventListener('click', async () => {
  registeredPasskey = await registerPasskey();
});

document.getElementById('deploy-account')!.addEventListener('click', async () => {
  await deployAccountFromPasskey(registeredPasskey);
});

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('ZeekMessages', (m) => {
  const zeekMessages = m.contract('ZeekMessages');

  m.call(zeekMessages, 'sendMessage', ['ZKsync Quickstart']);

  return { zeekMessages };
});

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('InteropToken', (m) => {
  const interopToken = m.contract('InteropToken', ['Interop Token', 'ITK']);

  return { interopToken };
});

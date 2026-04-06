import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('QuickstartToken', (m) => {
  const quickstartToken = m.contract('QuickstartToken', ['Quickstart Token', 'QKT']);

  return { quickstartToken };
});

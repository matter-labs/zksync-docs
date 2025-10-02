//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;
import { IL1Messenger } from '@matterlabs/zksync-contracts/contracts/system-contracts/interfaces/IL1Messenger.sol';

contract InteropSendMessage {
  address constant L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR = 0x0000000000000000000000000000000000008008;
  IL1Messenger public L1Messenger = IL1Messenger(L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR);

  function sendMessage(bytes calldata _message) public {
    L1Messenger.sendToL1(_message);
  }
}

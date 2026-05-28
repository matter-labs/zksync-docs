// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;

interface IL1Messenger {
    function sendToL1(bytes calldata _message) external returns (bytes32);
}

contract InteropSendMessage {
    address constant L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR = 0x0000000000000000000000000000000000008008;

    IL1Messenger public l1Messenger = IL1Messenger(L2_TO_L1_MESSENGER_SYSTEM_CONTRACT_ADDR);

    function sendMessage(bytes calldata _message) external {
        l1Messenger.sendToL1(_message);
    }
}

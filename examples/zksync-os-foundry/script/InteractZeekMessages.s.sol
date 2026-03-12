// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {ZeekMessages} from "../src/ZeekMessages.sol";

contract InteractZeekMessagesScript is Script {
    function run() public {
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        string memory message = "Hello from Foundry";

        vm.startBroadcast();

        ZeekMessages zeekMessages = ZeekMessages(contractAddress);
        zeekMessages.sendMessage(message);

        vm.stopBroadcast();

        console2.log("Total messages:", zeekMessages.getTotalMessages());
        console2.log("Last message:", zeekMessages.getLastMessage());
    }
}

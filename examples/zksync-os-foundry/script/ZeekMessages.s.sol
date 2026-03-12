// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {ZeekMessages} from "../src/ZeekMessages.sol";

contract ZeekMessagesScript is Script {
    ZeekMessages public zeekMessages;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        zeekMessages = new ZeekMessages();

        vm.stopBroadcast();
    }
}

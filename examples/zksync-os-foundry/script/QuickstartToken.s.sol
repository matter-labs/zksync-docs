// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {QuickstartToken} from "../src/QuickstartToken.sol";

contract QuickstartTokenScript is Script {
    QuickstartToken public quickstartToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        quickstartToken = new QuickstartToken("Quickstart Token", "QKT");

        vm.stopBroadcast();
    }
}

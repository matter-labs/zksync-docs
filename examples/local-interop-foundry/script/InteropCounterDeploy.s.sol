// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {InteropCounter} from "../contracts/InteropCounter.sol";

interface VmDeploy {
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
}

contract InteropCounterDeploy {
    uint256 internal constant LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;

    VmDeploy internal constant vm = VmDeploy(address(uint160(uint256(keccak256("hevm cheat code")))));

    event CounterDeployed(address counter, uint256 startingNumber);

    function run() external returns (address counterAddress) {
        vm.startBroadcast(LOCAL_PRIVATE_KEY);
        InteropCounter counter = new InteropCounter();
        counter.inc();
        vm.stopBroadcast();

        counterAddress = address(counter);
        emit CounterDeployed(counterAddress, counter.x());
    }
}

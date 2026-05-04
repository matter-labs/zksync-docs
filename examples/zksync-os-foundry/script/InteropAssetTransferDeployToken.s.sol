// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {InteropToken} from "../src/InteropToken.sol";

contract InteropAssetTransferDeployToken is Script {
    uint256 internal constant DEFAULT_LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;

    event TokenDeployed(address token);

    function run() external returns (address tokenAddress) {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);

        vm.startBroadcast(privateKey);
        InteropToken token = new InteropToken("Interop Token", "ITK");
        tokenAddress = address(token);
        vm.stopBroadcast();

        console2.log("InteropToken deployed on chain 6565:", tokenAddress);
        emit TokenDeployed(tokenAddress);
    }
}

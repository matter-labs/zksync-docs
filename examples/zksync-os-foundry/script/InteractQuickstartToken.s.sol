// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {QuickstartToken} from "../src/QuickstartToken.sol";

contract InteractQuickstartTokenScript is Script {
    uint256 internal constant TRANSFER_AMOUNT = 10 * 10 ** 18;
    address internal constant DEFAULT_RECIPIENT = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function run() public {
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        address recipientAddress = vm.envOr("RECIPIENT_ADDRESS", DEFAULT_RECIPIENT);
        QuickstartToken quickstartToken = QuickstartToken(contractAddress);
        uint256 recipientBalanceBefore = quickstartToken.balanceOf(recipientAddress);

        vm.startBroadcast();
        quickstartToken.transfer(recipientAddress, TRANSFER_AMOUNT);
        vm.stopBroadcast();

        console2.log("Token name:", quickstartToken.name());
        console2.log("Token symbol:", quickstartToken.symbol());
        console2.log("Total supply:", quickstartToken.totalSupply() / 10 ** 18);
        console2.log("Transferred amount:", TRANSFER_AMOUNT / 10 ** 18);
        console2.log(
            "Recipient balance increase:", (quickstartToken.balanceOf(recipientAddress) - recipientBalanceBefore) / 10 ** 18
        );
        console2.log("Recipient balance:", quickstartToken.balanceOf(recipientAddress) / 10 ** 18);
    }
}

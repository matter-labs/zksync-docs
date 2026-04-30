// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {InteropCounter} from "../src/InteropCounter.sol";

interface IInteropHandlerExec {
    struct L2Message {
        uint16 txNumberInBatch;
        address sender;
        bytes data;
    }

    struct MessageInclusionProof {
        uint256 chainId;
        uint256 l1BatchNumber;
        uint256 l2MessageIndex;
        L2Message message;
        bytes32[] proof;
    }

    function executeBundle(bytes calldata bundle, MessageInclusionProof calldata proof) external;
}

interface VmFinalize {
    function startBroadcast() external;
    function stopBroadcast() external;
}

contract InteropCounterFinalizeBundle {
    address internal constant INTEROP_HANDLER_ADDRESS = 0x000000000000000000000000000000000001000E;
    IInteropHandlerExec internal constant INTEROP_HANDLER = IInteropHandlerExec(INTEROP_HANDLER_ADDRESS);
    VmFinalize internal constant vm = VmFinalize(address(uint160(uint256(keccak256("hevm cheat code")))));

    event BundleFinalized(bytes32 bundleHash, uint256 finalCounterValue);

    function run(address counterAddress, bytes calldata proofEncoded) public returns (uint256 finalCounterValue) {
        IInteropHandlerExec.MessageInclusionProof memory proof =
            abi.decode(proofEncoded, (IInteropHandlerExec.MessageInclusionProof));
        bytes memory bundleEncoded = _bundleFromMessageData(proof.message.data);

        vm.startBroadcast();
        INTEROP_HANDLER.executeBundle(bundleEncoded, proof);
        vm.stopBroadcast();

        finalCounterValue = InteropCounter(counterAddress).x();
        emit BundleFinalized(keccak256(bundleEncoded), finalCounterValue);
    }

    function _bundleFromMessageData(bytes memory messageData) internal pure returns (bytes memory) {
        require(messageData.length > 0, "missing message data");
        require(messageData[0] == bytes1(0x01), "unexpected bundle prefix");

        bytes memory out = new bytes(messageData.length - 1);
        for (uint256 i = 1; i < messageData.length; ++i) {
            out[i - 1] = messageData[i];
        }
        return out;
    }
}

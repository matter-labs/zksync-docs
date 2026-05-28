// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {InteropCounter} from "../contracts/InteropCounter.sol";

interface VmFinalize {
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function createFork(string calldata urlOrAlias) external returns (uint256 forkId);
    function selectFork(uint256 forkId) external;
}

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

contract InteropCounterFinalizeBundle {
    uint256 internal constant LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;
    string internal constant CHAIN2_RPC_URL = "http://localhost:3051";

    address internal constant INTEROP_HANDLER_ADDRESS = 0x000000000000000000000000000000000001000E;

    VmFinalize internal constant vm = VmFinalize(address(uint160(uint256(keccak256("hevm cheat code")))));
    IInteropHandlerExec internal constant INTEROP_HANDLER = IInteropHandlerExec(INTEROP_HANDLER_ADDRESS);

    event BundleFinalized(bytes32 bundleHash, uint256 finalCounterValue);

    function run(address counterAddress, bytes calldata proofEncoded) external returns (uint256 finalCounterValue) {
        uint256 chain2Fork = vm.createFork(CHAIN2_RPC_URL);
        vm.selectFork(chain2Fork);

        IInteropHandlerExec.MessageInclusionProof memory proof =
            abi.decode(proofEncoded, (IInteropHandlerExec.MessageInclusionProof));
        bytes memory bundleEncoded = _bundleFromMessageData(proof.message.data);

        vm.startBroadcast(LOCAL_PRIVATE_KEY);
        INTEROP_HANDLER.executeBundle(bundleEncoded, proof);
        finalCounterValue = InteropCounter(counterAddress).x();
        vm.stopBroadcast();

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

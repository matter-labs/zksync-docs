// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

interface IL2NativeTokenVaultMinimal {
    function assetId(address token) external view returns (bytes32);
    function tokenAddress(bytes32 assetId) external view returns (address);
}

contract InteropAssetTransferFinalizeBundle is Script {
    uint256 internal constant DEFAULT_LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;

    struct FinalizeConfig {
        string chain1RpcUrl;
        string chain2RpcUrl;
        address interopHandlerAddress;
        address l2NativeTokenVaultAddress;
    }

    event BundleFinalized(bytes32 bundleHash, address sourceToken, address destinationToken, bytes32 assetId);

    function run(address sourceToken, bytes calldata proofEncoded)
        external
        returns (address destinationToken, uint256 sourceBalanceAfter, uint256 destinationBalanceAfter)
    {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);
        address sender = vm.addr(privateKey);
        FinalizeConfig memory config = FinalizeConfig({
            chain1RpcUrl: vm.envOr("CHAIN1_RPC_URL", string("http://localhost:3050")),
            chain2RpcUrl: vm.envOr("CHAIN2_RPC_URL", string("http://localhost:3051")),
            interopHandlerAddress: 0x000000000000000000000000000000000001000E,
            l2NativeTokenVaultAddress: 0x0000000000000000000000000000000000010004
        });

        uint256 chain1Fork = vm.createFork(config.chain1RpcUrl);
        uint256 chain2Fork = vm.createFork(config.chain2RpcUrl);

        bytes32 assetId;
        vm.selectFork(chain1Fork);
        assetId = IL2NativeTokenVaultMinimal(config.l2NativeTokenVaultAddress).assetId(sourceToken);

        IInteropHandlerExec.MessageInclusionProof memory proof =
            abi.decode(proofEncoded, (IInteropHandlerExec.MessageInclusionProof));
        bytes memory bundleEncoded = _bundleFromMessageData(proof.message.data);

        vm.selectFork(chain2Fork);
        vm.startBroadcast(privateKey);
        IInteropHandlerExec(config.interopHandlerAddress).executeBundle(bundleEncoded, proof);
        vm.stopBroadcast();

        destinationToken = IL2NativeTokenVaultMinimal(config.l2NativeTokenVaultAddress).tokenAddress(assetId);
        require(destinationToken != address(0), "destination token missing");
        destinationBalanceAfter = IERC20(destinationToken).balanceOf(sender);

        vm.selectFork(chain1Fork);
        sourceBalanceAfter = IERC20(sourceToken).balanceOf(sender);

        console2.log("Chain 6565 balance after interop:", sourceBalanceAfter);
        console2.log("Mapped token on chain 6566 after interop:", destinationToken);
        console2.log("Chain 6566 balance after interop:", destinationBalanceAfter);

        emit BundleFinalized(keccak256(bundleEncoded), sourceToken, destinationToken, assetId);
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

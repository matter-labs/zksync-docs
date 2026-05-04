// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {InteropToken} from "../src/InteropToken.sol";

interface IInteropCenterMinimal {
    struct InteropCallStarter {
        bytes to;
        bytes data;
        bytes[] callAttributes;
    }

    function sendBundle(
        bytes calldata destinationChainId,
        InteropCallStarter[] calldata callStarters,
        bytes[] calldata bundleAttributes
    ) external payable returns (bytes32 bundleHash);

    function interopProtocolFee() external view returns (uint256);
}

interface IL2NativeTokenVaultMinimal {
    function ensureTokenIsRegistered(address token) external returns (bytes32);
}

interface IERC7786AttributesMinimal {
    function indirectCall(uint256 messageValue) external;
    function useFixedFee(bool enabled) external;
}

contract InteropAssetTransferDeployAndSendBundle is Script {
    uint256 internal constant CHAIN2_ID = 6566;
    uint256 internal constant DEFAULT_TRANSFER_AMOUNT = 1_000_000;
    uint256 internal constant MIN_NATIVE_GAS_BUFFER = 0.002 ether;
    uint256 internal constant DEFAULT_LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;

    struct InteropConfig {
        address interopCenterAddress;
        address l2NativeTokenVaultAddress;
        address l2AssetRouterAddress;
    }

    event TokenDeployed(address token);
    event BundleSent(bytes32 bundleHash, address token, uint256 destinationChainId, bytes32 assetId);

    function run() external returns (address tokenAddress, bytes32 bundleHash, bytes32 assetId) {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);
        address sender = vm.addr(privateKey);
        string memory chain1RpcUrl = vm.envOr("CHAIN1_RPC_URL", string("http://localhost:3050"));
        InteropConfig memory config = InteropConfig({
            interopCenterAddress: vm.envAddress("INTEROP_CENTER_ADDRESS"),
            l2NativeTokenVaultAddress: vm.envAddress("L2_NATIVE_TOKEN_VAULT_ADDRESS"),
            l2AssetRouterAddress: vm.envAddress("L2_ASSET_ROUTER_ADDRESS")
        });

        uint256 chain1Fork = vm.createFork(chain1RpcUrl);
        vm.selectFork(chain1Fork);

        uint256 nativeBalanceBefore = sender.balance;
        uint256 interopFee = IInteropCenterMinimal(config.interopCenterAddress).interopProtocolFee();
        require(
            nativeBalanceBefore >= interopFee + MIN_NATIVE_GAS_BUFFER,
            "insufficient native balance for deployment, interop fee, and gas"
        );

        vm.startBroadcast(privateKey);
        InteropToken token = new InteropToken("Interop Token", "ITK");
        tokenAddress = address(token);
        token.approve(config.l2NativeTokenVaultAddress, DEFAULT_TRANSFER_AMOUNT);
        (bundleHash, assetId) = _sendErc20Bundle(config, CHAIN2_ID, tokenAddress, sender, DEFAULT_TRANSFER_AMOUNT, interopFee);
        vm.stopBroadcast();

        uint256 sourceBalanceAfter = IERC20(tokenAddress).balanceOf(sender);

        console2.log("Deployed InteropToken on chain 6565:", tokenAddress);
        console2.logBytes32(assetId);
        console2.log("Chain 6565 balance after bundle send:", sourceBalanceAfter);
        console2.log("Interop fee:", interopFee);
        console2.log("Native balance before deployment and interop:", nativeBalanceBefore);
        console2.logBytes32(bundleHash);

        emit TokenDeployed(tokenAddress);
        emit BundleSent(bundleHash, tokenAddress, CHAIN2_ID, assetId);
    }

    function _sendErc20Bundle(
        InteropConfig memory config,
        uint256 destinationChainId,
        address token,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (bytes32 bundleHash, bytes32 assetId) {
        assetId = IL2NativeTokenVaultMinimal(config.l2NativeTokenVaultAddress).ensureTokenIsRegistered(token);

        bytes memory destinationChain = _formatEvmV1Chain(destinationChainId);
        bytes memory transferData = abi.encode(amount, recipient, token);
        bytes memory assetRouterPayload = bytes.concat(bytes1(0x01), abi.encode(assetId, transferData));

        IInteropCenterMinimal.InteropCallStarter[] memory starters = new IInteropCenterMinimal.InteropCallStarter[](1);
        starters[0] = IInteropCenterMinimal.InteropCallStarter({
            to: _formatEvmV1AddressOnly(config.l2AssetRouterAddress),
            data: assetRouterPayload,
            callAttributes: _defaultCallAttributes()
        });

        bundleHash = IInteropCenterMinimal(config.interopCenterAddress).sendBundle{value: fee}(
            destinationChain, starters, _defaultBundleAttributes()
        );
    }

    function _defaultCallAttributes() internal pure returns (bytes[] memory callAttributes) {
        callAttributes = new bytes[](1);
        callAttributes[0] = abi.encodeCall(IERC7786AttributesMinimal.indirectCall, (0));
    }

    function _defaultBundleAttributes() internal pure returns (bytes[] memory bundleAttributes) {
        bundleAttributes = new bytes[](1);
        bundleAttributes[0] = abi.encodeCall(IERC7786AttributesMinimal.useFixedFee, (false));
    }

    function _formatEvmV1Chain(uint256 chainId) internal pure returns (bytes memory) {
        bytes memory chainRef = _toChainReference(chainId);
        return abi.encodePacked(bytes4(0x00010000), uint8(chainRef.length), chainRef, uint8(0));
    }

    function _formatEvmV1AddressOnly(address addr) internal pure returns (bytes memory) {
        return abi.encodePacked(bytes6(0x000100000014), addr);
    }

    function _toChainReference(uint256 chainId) internal pure returns (bytes memory out) {
        if (chainId == 0) {
            out = new bytes(1);
            out[0] = bytes1(uint8(0));
            return out;
        }

        uint256 tmp = chainId;
        uint256 len;
        while (tmp != 0) {
            unchecked {
                ++len;
            }
            tmp >>= 8;
        }

        out = new bytes(len);
        for (uint256 i = len; i > 0; ) {
            // forge-lint: disable-next-line(unsafe-typecast)
            out[i - 1] = bytes1(uint8(chainId));
            chainId >>= 8;
            unchecked {
                --i;
            }
        }
    }
}

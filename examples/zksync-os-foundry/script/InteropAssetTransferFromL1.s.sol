// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {InteropToken} from "../src/InteropToken.sol";

interface IBridgehubMinimal {
    struct L2TransactionRequestTwoBridgesOuter {
        uint256 chainId;
        uint256 mintValue;
        uint256 l2Value;
        uint256 l2GasLimit;
        uint256 l2GasPerPubdataByteLimit;
        address refundRecipient;
        address secondBridgeAddress;
        uint256 secondBridgeValue;
        bytes secondBridgeCalldata;
    }

    function l2TransactionBaseCost(
        uint256 chainId,
        uint256 gasPrice,
        uint256 l2GasLimit,
        uint256 l2GasPerPubdataByteLimit
    ) external view returns (uint256);

    function requestL2TransactionTwoBridges(L2TransactionRequestTwoBridgesOuter calldata request)
        external
        payable
        returns (bytes32 canonicalTxHash);
}

interface IL2NativeTokenVaultMinimal {
    function L1_CHAIN_ID() external view returns (uint256);

    function calculateCreate2TokenAddress(uint256 originChainId, address l1Token) external view returns (address);

    function l2TokenAddress(address l1Token) external view returns (address);
}

contract InteropAssetTransferFromL1 is Script {
    uint256 internal constant DEFAULT_CHAIN1_ID = 6565;
    uint256 internal constant DEFAULT_DEPOSIT_AMOUNT = 10_000_000;
    uint256 internal constant DEFAULT_L2_GAS_LIMIT = 10_000_000;
    uint256 internal constant DEFAULT_GAS_PER_PUBDATA = 800;
    address internal constant DEFAULT_L1_BRIDGEHUB_ADDRESS = 0x4c548076C53BA29A7DDdAc6Fe463C57CDE78a3d8;
    address internal constant DEFAULT_L1_ASSET_ROUTER_ADDRESS = 0x257388ae77Ce7Bf0D74eAEF14Ca86c361c155361;
    address internal constant DEFAULT_SOURCE_L2_NATIVE_TOKEN_VAULT_ADDRESS =
        0x0000000000000000000000000000000000010004;
    uint256 internal constant DEFAULT_LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;

    struct DepositConfig {
        address bridgehubAddress;
        address l1AssetRouterAddress;
        address sourceL2NativeTokenVaultAddress;
        uint256 chain1Id;
        string l1RpcUrl;
        string chain1RpcUrl;
    }

    event L1TokenDeployed(address token);
    event L1DepositRequested(address token, address bridgedTokenOn6565, bytes32 canonicalTxHash, uint256 amount);

    function run() external returns (address l1TokenAddress, address bridgedTokenOn6565, bytes32 canonicalTxHash) {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);
        address sender = vm.addr(privateKey);
        DepositConfig memory config = DepositConfig({
            bridgehubAddress: vm.envOr("L1_BRIDGEHUB_ADDRESS", DEFAULT_L1_BRIDGEHUB_ADDRESS),
            l1AssetRouterAddress: vm.envOr("L1_ASSET_ROUTER_ADDRESS", DEFAULT_L1_ASSET_ROUTER_ADDRESS),
            sourceL2NativeTokenVaultAddress: vm.envOr(
                "SOURCE_L2_NATIVE_TOKEN_VAULT_ADDRESS",
                DEFAULT_SOURCE_L2_NATIVE_TOKEN_VAULT_ADDRESS
            ),
            chain1Id: vm.envOr("CHAIN1_ID", DEFAULT_CHAIN1_ID),
            l1RpcUrl: vm.envOr("L1_RPC_URL", string("http://localhost:8545")),
            chain1RpcUrl: vm.envOr("CHAIN1_RPC_URL", string("http://localhost:3050"))
        });

        uint256 l1Fork = vm.createFork(config.l1RpcUrl);
        uint256 chain1Fork = vm.createFork(config.chain1RpcUrl);

        vm.selectFork(l1Fork);
        vm.startBroadcast(privateKey);
        InteropToken l1Token = new InteropToken("L1 Interop Token", "L1IT");
        l1TokenAddress = address(l1Token);
        l1Token.approve(config.l1AssetRouterAddress, DEFAULT_DEPOSIT_AMOUNT);

        uint256 l1GasPrice = tx.gasprice == 0 ? block.basefee : tx.gasprice;
        (uint256 mintValue, IBridgehubMinimal.L2TransactionRequestTwoBridgesOuter memory request) =
            _buildDepositRequest(config, l1TokenAddress, sender, l1GasPrice);
        canonicalTxHash =
            IBridgehubMinimal(config.bridgehubAddress).requestL2TransactionTwoBridges{value: mintValue}(request);
        vm.stopBroadcast();

        vm.selectFork(chain1Fork);
        bridgedTokenOn6565 = _predictBridgedTokenAddress(config.sourceL2NativeTokenVaultAddress, l1TokenAddress);

        console2.log("L1 token deployed at:", l1TokenAddress);
        console2.log("Predicted bridged token on target chain:", bridgedTokenOn6565);
        console2.log("Target chain ID:", config.chain1Id);
        console2.logBytes32(canonicalTxHash);
        console2.log("Wait for the deposit to finalize on the target chain before sending the interop bundle.");

        emit L1TokenDeployed(l1TokenAddress);
        emit L1DepositRequested(l1TokenAddress, bridgedTokenOn6565, canonicalTxHash, DEFAULT_DEPOSIT_AMOUNT);
    }

    function _predictBridgedTokenAddress(address nativeTokenVaultAddress, address l1TokenAddress)
        internal
        view
        returns (address)
    {
        IL2NativeTokenVaultMinimal l2NativeTokenVault = IL2NativeTokenVaultMinimal(nativeTokenVaultAddress);
        uint256 l1ChainId = l2NativeTokenVault.L1_CHAIN_ID();
        return l2NativeTokenVault.calculateCreate2TokenAddress(l1ChainId, l1TokenAddress);
    }

    function _buildDepositRequest(
        DepositConfig memory config,
        address l1TokenAddress,
        address sender,
        uint256 l1GasPrice
    ) internal view returns (uint256 mintValue, IBridgehubMinimal.L2TransactionRequestTwoBridgesOuter memory request) {
        mintValue = IBridgehubMinimal(config.bridgehubAddress).l2TransactionBaseCost(
            config.chain1Id, l1GasPrice, DEFAULT_L2_GAS_LIMIT, DEFAULT_GAS_PER_PUBDATA
        );
        request = IBridgehubMinimal.L2TransactionRequestTwoBridgesOuter({
            chainId: config.chain1Id,
            mintValue: mintValue,
            l2Value: 0,
            l2GasLimit: DEFAULT_L2_GAS_LIMIT,
            l2GasPerPubdataByteLimit: DEFAULT_GAS_PER_PUBDATA,
            refundRecipient: sender,
            secondBridgeAddress: config.l1AssetRouterAddress,
            secondBridgeValue: 0,
            secondBridgeCalldata: abi.encode(l1TokenAddress, DEFAULT_DEPOSIT_AMOUNT, sender)
        });
    }
}

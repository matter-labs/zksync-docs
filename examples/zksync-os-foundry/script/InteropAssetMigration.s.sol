// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";

interface IL2NativeTokenVaultMigrationMinimal {
    function assetId(address token) external view returns (bytes32);
    function ensureTokenIsRegistered(address token) external returns (bytes32);
}

interface IL2AssetTrackerMinimal {
    function initiateL1ToGatewayMigrationOnL2(bytes32 assetId) external;
    function tokenMigratedThisChain(bytes32 assetId) external view returns (bool);
    function assetMigrationNumber(uint256 chainId, bytes32 assetId) external view returns (uint256);
}

interface IL1AssetRouterMinimal {
    function nativeTokenVault() external view returns (address);
}

interface IL1NativeTokenVaultMigrationMinimal {
    function l1AssetTracker() external view returns (address);
}

interface IL1AssetTrackerMinimal {
    struct FinalizeL1ToGatewayMigrationParams {
        uint256 chainId;
        uint256 l2BatchNumber;
        uint256 l2MessageIndex;
        address l2Sender;
        uint16 l2TxNumberInBatch;
        bytes message;
        bytes32[] merkleProof;
    }

    function receiveL1ToGatewayMigrationOnL1(FinalizeL1ToGatewayMigrationParams calldata params) external;
}

contract InteropAssetMigration is Script {
    uint256 internal constant DEFAULT_LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;
    address internal constant DEFAULT_L2_NATIVE_TOKEN_VAULT_ADDRESS =
        0x0000000000000000000000000000000000010004;
    address internal constant DEFAULT_L2_ASSET_TRACKER_ADDRESS = 0x000000000000000000000000000000000001000f;
    address internal constant DEFAULT_L1_ASSET_ROUTER_ADDRESS = 0x257388ae77Ce7Bf0D74eAEF14Ca86c361c155361;

    event MigrationInitiated(address token, bytes32 assetId, uint256 sourceChainId);
    event MigrationFinalizedOnL1(address l1AssetTrackerAddress, uint256 sourceChainId, uint256 l2BatchNumber);

    function run(address tokenAddress) external returns (bytes32 assetId) {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);
        address l2NativeTokenVaultAddress =
            vm.envOr("L2_NATIVE_TOKEN_VAULT_ADDRESS", DEFAULT_L2_NATIVE_TOKEN_VAULT_ADDRESS);
        address l2AssetTrackerAddress = vm.envOr("L2_ASSET_TRACKER_ADDRESS", DEFAULT_L2_ASSET_TRACKER_ADDRESS);

        IL2NativeTokenVaultMigrationMinimal nativeTokenVault =
            IL2NativeTokenVaultMigrationMinimal(l2NativeTokenVaultAddress);
        IL2AssetTrackerMinimal assetTracker = IL2AssetTrackerMinimal(l2AssetTrackerAddress);

        assetId = nativeTokenVault.assetId(tokenAddress);
        if (assetId == bytes32(0)) {
            console2.log("Token is not registered in the L2 Native Token Vault yet. Registering now...");

            vm.startBroadcast(privateKey);
            nativeTokenVault.ensureTokenIsRegistered(tokenAddress);
            vm.stopBroadcast();

            assetId = nativeTokenVault.assetId(tokenAddress);
        }

        uint256 sourceChainId = block.chainid;
        bool migratedBefore = assetTracker.tokenMigratedThisChain(assetId);
        uint256 migrationNumberBefore = assetTracker.assetMigrationNumber(sourceChainId, assetId);

        console2.log("Token migration status before:");
        console2.log("Source token on chain 6565:", tokenAddress);
        console2.logBytes32(assetId);
        console2.log("Migrated before:", migratedBefore);
        console2.log("Migration number before:", migrationNumberBefore);

        if (migratedBefore) {
            console2.log("Token is already migrated on this chain. Nothing to do.");
            return assetId;
        }

        vm.startBroadcast(privateKey);
        assetTracker.initiateL1ToGatewayMigrationOnL2(assetId);
        vm.stopBroadcast();

        console2.log("Gateway migration initiated on chain 6565.");
        console2.log("Use the last chain 6565 transaction hash from this script output in the next step.");
        emit MigrationInitiated(tokenAddress, assetId, sourceChainId);
    }

    function run(bytes calldata finalizeParamsEncoded) external returns (address l1AssetTrackerAddress) {
        uint256 privateKey = vm.envOr("LOCAL_PRIVATE_KEY", DEFAULT_LOCAL_PRIVATE_KEY);
        address l1AssetRouterAddress = vm.envOr("L1_ASSET_ROUTER_ADDRESS", DEFAULT_L1_ASSET_ROUTER_ADDRESS);

        address l1NativeTokenVaultAddress = IL1AssetRouterMinimal(l1AssetRouterAddress).nativeTokenVault();
        l1AssetTrackerAddress =
            IL1NativeTokenVaultMigrationMinimal(l1NativeTokenVaultAddress).l1AssetTracker();

        IL1AssetTrackerMinimal.FinalizeL1ToGatewayMigrationParams memory finalizeParams =
            abi.decode(finalizeParamsEncoded, (IL1AssetTrackerMinimal.FinalizeL1ToGatewayMigrationParams));

        vm.startBroadcast(privateKey);
        IL1AssetTrackerMinimal(l1AssetTrackerAddress).receiveL1ToGatewayMigrationOnL1(finalizeParams);
        vm.stopBroadcast();

        console2.log("L1 Native Token Vault:", l1NativeTokenVaultAddress);
        console2.log("L1 Asset Tracker:", l1AssetTrackerAddress);
        console2.log("Gateway migration finalized on L1.");
        emit MigrationFinalizedOnL1(l1AssetTrackerAddress, finalizeParams.chainId, finalizeParams.l2BatchNumber);
    }

    function status(address tokenAddress) external view returns (bytes32 assetId, bool migrated, uint256 migrationNumber) {
        address l2NativeTokenVaultAddress =
            vm.envOr("L2_NATIVE_TOKEN_VAULT_ADDRESS", DEFAULT_L2_NATIVE_TOKEN_VAULT_ADDRESS);
        address l2AssetTrackerAddress = vm.envOr("L2_ASSET_TRACKER_ADDRESS", DEFAULT_L2_ASSET_TRACKER_ADDRESS);

        assetId = IL2NativeTokenVaultMigrationMinimal(l2NativeTokenVaultAddress).assetId(tokenAddress);
        require(assetId != bytes32(0), "token not registered");

        migrated = IL2AssetTrackerMinimal(l2AssetTrackerAddress).tokenMigratedThisChain(assetId);
        migrationNumber = IL2AssetTrackerMinimal(l2AssetTrackerAddress).assetMigrationNumber(block.chainid, assetId);

        console2.log("Source token on chain 6565:", tokenAddress);
        console2.logBytes32(assetId);
        console2.log("Migrated:", migrated);
        console2.log("Migration number:", migrationNumber);
    }
}

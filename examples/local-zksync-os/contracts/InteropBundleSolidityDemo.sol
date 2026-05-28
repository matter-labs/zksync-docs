// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal local interface for InteropCenter.sendBundle.
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
}

/// @notice Minimal local interface for InteropHandler.executeBundle.
interface IInteropHandlerMinimal {
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

/// @notice Demo contract showing how to send and finalize interop bundles in Solidity.
contract InteropBundleSolidityDemo {
    IInteropCenterMinimal public constant INTEROP_CENTER =
        IInteropCenterMinimal(0x000000000000000000000000000000000001000d);
    IInteropHandlerMinimal public constant INTEROP_HANDLER =
        IInteropHandlerMinimal(0x000000000000000000000000000000000001000E);

    /// @notice Send a 1-call bundle to a destination chain.
    /// @param destinationChainId EVM chain id of the destination chain.
    /// @param target Target contract on destination chain (must support ERC-7786 receive flow).
    /// @param payload Raw payload passed through the interop call.
    /// @return bundleHash Hash returned by InteropCenter.
    function sendSingleCallBundle(
        uint256 destinationChainId,
        address target,
        bytes calldata payload
    ) external payable returns (bytes32 bundleHash) {
        bytes memory dstChain = _formatEvmV1Chain(destinationChainId);

        IInteropCenterMinimal.InteropCallStarter[]
            memory starters = new IInteropCenterMinimal.InteropCallStarter[](1);
        starters[0] = IInteropCenterMinimal.InteropCallStarter({
            to: _formatEvmV1AddressOnly(target),
            data: payload,
            callAttributes: new bytes[](0)
        });

        bundleHash = INTEROP_CENTER.sendBundle{value: msg.value}(dstChain, starters, new bytes[](0));
    }

    /// @notice Finalize and execute a bundle on the destination chain.
    /// @dev `bundle` and `proof` are expected to come from offchain tooling/indexers.
    /// @param bundle ABI-encoded InteropBundle.
    /// @param proof Message inclusion proof for that bundle.
    function finalizeBundle(
        bytes calldata bundle,
        IInteropHandlerMinimal.MessageInclusionProof calldata proof
    ) external {
        INTEROP_HANDLER.executeBundle(bundle, proof);
    }

    /// @dev ERC-7930 format for "EVM chain id only" (empty address field).
    function _formatEvmV1Chain(uint256 chainid) internal pure returns (bytes memory) {
        bytes memory chainRef = _toChainReference(chainid);
        return abi.encodePacked(bytes4(0x00010000), uint8(chainRef.length), chainRef, uint8(0));
    }

    /// @dev ERC-7930 format for "EVM address only" (empty chain reference).
    function _formatEvmV1AddressOnly(address addr) internal pure returns (bytes memory) {
        return abi.encodePacked(bytes6(0x000100000014), addr);
    }

    /// @dev Minimal `chainid -> compact bytes` helper used by ERC-7930.
    function _toChainReference(uint256 chainid) internal pure returns (bytes memory out) {
        if (chainid == 0) {
            out = new bytes(1);
            out[0] = bytes1(uint8(0));
            return out;
        }

        uint256 tmp = chainid;
        uint256 len;
        while (tmp != 0) {
            unchecked {
                ++len;
            }
            tmp >>= 8;
        }

        out = new bytes(len);
        for (uint256 i = len; i > 0; ) {
            out[i - 1] = bytes1(uint8(chainid));
            chainid >>= 8;
            unchecked {
                --i;
            }
        }
    }
}

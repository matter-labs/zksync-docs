// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface VmSend {
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function createFork(string calldata urlOrAlias) external returns (uint256 forkId);
    function selectFork(uint256 forkId) external;
}

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

contract InteropCounterSendBundle {
    uint256 internal constant LOCAL_PRIVATE_KEY =
        0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110;
    uint256 internal constant CHAIN2_ID = 6566;
    string internal constant CHAIN1_RPC_URL = "http://localhost:3050";

    address internal constant INTEROP_CENTER_ADDRESS = 0x000000000000000000000000000000000001000d;
    IInteropCenterMinimal internal constant INTEROP_CENTER = IInteropCenterMinimal(INTEROP_CENTER_ADDRESS);

    VmSend internal constant vm = VmSend(address(uint160(uint256(keccak256("hevm cheat code")))));

    event BundleSent(bytes32 bundleHash, address target, uint256 destinationChainId);

    function run(address counter) external returns (bytes32 bundleHash) {
        uint256 chain1Fork = vm.createFork(CHAIN1_RPC_URL);
        vm.selectFork(chain1Fork);

        vm.startBroadcast(LOCAL_PRIVATE_KEY);
        bundleHash = _sendSingleActionBundle(CHAIN2_ID, counter, abi.encode(uint8(0)));
        vm.stopBroadcast();

        emit BundleSent(bundleHash, counter, CHAIN2_ID);
    }

    function _sendSingleActionBundle(uint256 destinationChainId, address target, bytes memory payload)
        internal
        returns (bytes32)
    {
        bytes memory dstChain = _formatEvmV1Chain(destinationChainId);

        IInteropCenterMinimal.InteropCallStarter[] memory starters = new IInteropCenterMinimal.InteropCallStarter[](1);
        starters[0] = IInteropCenterMinimal.InteropCallStarter({
            to: _formatEvmV1AddressOnly(target),
            data: payload,
            callAttributes: new bytes[](0)
        });

        return INTEROP_CENTER.sendBundle(dstChain, starters, new bytes[](0));
    }

    function _formatEvmV1Chain(uint256 chainid) internal pure returns (bytes memory) {
        bytes memory chainRef = _toChainReference(chainid);
        return abi.encodePacked(bytes4(0x00010000), uint8(chainRef.length), chainRef, uint8(0));
    }

    function _formatEvmV1AddressOnly(address addr) internal pure returns (bytes memory) {
        return abi.encodePacked(bytes6(0x000100000014), addr);
    }

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
        for (uint256 i = len; i > 0;) {
            out[i - 1] = bytes1(uint8(chainid));
            chainid >>= 8;
            unchecked {
                --i;
            }
        }
    }
}

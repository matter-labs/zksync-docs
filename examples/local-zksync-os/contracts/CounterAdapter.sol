// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC7786Recipient {
    function receiveMessage(
        bytes32 receiveId,
        bytes calldata sender,
        bytes calldata payload
    ) external payable returns (bytes4);
}

interface ICounter {
    function inc() external;
    function incBy(uint256 by) external;
}

/// @notice Interop receiver adapter for an existing Counter-like contract.
/// @dev InteropHandler calls receiveMessage(); this adapter decodes payload and
///      forwards to target contract methods.
contract CounterInteropAdapter is IERC7786Recipient {
    ICounter public immutable counter;

    address constant INTEROP_HANDLER = 0x000000000000000000000000000000000001000E;

    error Unauthorized(address caller);
    error UnknownOp(uint8 op);

    event InteropAction(bytes32 indexed receiveId, bytes sender, uint8 op, uint256 by);

    constructor(address _counter) {
        require(_counter != address(0), "counter is zero");
        counter = ICounter(_counter);
    }

    /// payload format:
    /// - abi.encode(uint8(0))               => counter.inc()
    /// - abi.encode(uint8(1), uint256(by))  => counter.incBy(by)
    function receiveMessage(
        bytes32 receiveId,
        bytes calldata sender,
        bytes calldata payload
    ) external payable override returns (bytes4) {
        if (msg.sender != INTEROP_HANDLER) revert Unauthorized(msg.sender);

        (uint8 op, uint256 by) = _decodePayload(payload);

        if (op == 0) {
            counter.inc();
        } else if (op == 1) {
            counter.incBy(by);
        } else {
            revert UnknownOp(op);
        }

        emit InteropAction(receiveId, sender, op, by);
        return IERC7786Recipient.receiveMessage.selector;
    }

    function _decodePayload(bytes calldata payload) internal pure returns (uint8 op, uint256 by) {
        if (payload.length == 32) {
            op = abi.decode(payload, (uint8));
            by = 0;
        } else {
            (op, by) = abi.decode(payload, (uint8, uint256));
        }
    }
}

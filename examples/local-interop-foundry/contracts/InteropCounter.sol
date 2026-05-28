// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract InteropCounter {
    uint256 public x;

    address constant INTEROP_HANDLER = 0x000000000000000000000000000000000001000E;

    event Increment(uint256 by);

    function inc() public {
        x++;
        emit Increment(1);
    }

    function incBy(uint256 by) public {
        require(by > 0, "incBy: increment should be positive");
        x += by;
        emit Increment(by);
    }

    // payload format example:
    //   abi.encode(uint8(0))              => inc()
    //   abi.encode(uint8(1), uint256(5))  => incBy(5)
    // ANCHOR: receive-message-interface
    function receiveMessage(
        bytes32,        // message id
        bytes calldata, // ERC-7930 sender
        bytes calldata payload // bundle payload
    ) external payable returns (bytes4) {
    // ANCHOR_END: receive-message-interface
        require(msg.sender == INTEROP_HANDLER, "only interop handler");

        (uint8 op, uint256 by) = _decodePayload(payload);

        if (op == 0) {
            inc();
        } else if (op == 1) {
            incBy(by);
        } else {
            revert("unknown op");
        }

        return this.receiveMessage.selector;
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
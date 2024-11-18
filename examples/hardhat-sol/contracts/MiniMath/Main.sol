// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MiniMath.sol";

contract Main {
    uint256 public lastNumber;

    function storeSquare(uint256 x) public {
        uint256 square = MiniMath.square(x);
        lastNumber = square;
    }
}

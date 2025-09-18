//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;

// TODO: replace with IMessageVerification.sol from @matterlabs/zksync-contracts
import { IMessageVerification } from './Interface.sol';
import { L2Message } from '@matterlabs/zksync-contracts/contracts/l1-contracts/common/Messaging.sol';

contract InteropVerification {
  address constant L2_MESSAGE_VERIFICATION_ADDRESS = 0x0000000000000000000000000000000000010009;

  IMessageVerification public l2MessageVerifier = IMessageVerification(L2_MESSAGE_VERIFICATION_ADDRESS);

  function checkVerification(
    uint256 _sourceChainId,
    uint256 _l1BatchNumber,
    uint256 _l2MessageIndex,
    L2Message calldata _l2MessageData,
    bytes32[] calldata _proof
  ) public view returns (bool) {
    bool result = l2MessageVerifier.proveL2MessageInclusionShared(
      _sourceChainId,
      _l1BatchNumber,
      _l2MessageIndex,
      _l2MessageData,
      _proof
    );
    return result;
  }
}

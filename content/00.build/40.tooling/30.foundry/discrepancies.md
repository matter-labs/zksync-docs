---
title: ZK Foundry Discrepancies Guide
description: Learn about differences with original foundry.
---

::callout{icon="i-heroicons-information-circle-16-solid" color="amber"}
We are actively working on an analogue of the original Foundry book for ZKsync. It will provide in-depth information
about ZKsync foundry. Stay tuned!
::

Migrating to use ZK Foundry from Foundry involves several crucial aspects that need careful consideration.
This document aims to comprehensively introduce these key factors, ensuring a smooth and efficient transition.
We will cover the **fundamental** differences, potential challenges, and best practices for a successful migration.

To learn more about made changes, features and limitations, please check out ZKsync Foundry [overview](/build/tooling/foundry/overview) page.

::callout{icon="i-heroicons-information-circle-16-solid" color="amber"}
Note: this guide is still work-in-progress and is going to be fullfilled in the near future.
::

## Reserved Addresses
In ZKsync any address below `2^16` is demarcated as reserved. These addresses are often set during foundry fuzzing and can cause unwanted failures.
To avoid these failures use `vm.assume(addr > address(65535)`
and 65535 instances of `vm.excludeSender`(`vm.excludeSender(1)`, `vm.excludeSender(2)`, etc.)
But this can inadvertently slow down testing and/or cause "too many rejections" failure in `proptest`, in addition to being hugely cumbersome.

```sol
  function test_BalanceIncremented() public {
      nft.mintTo{value: 0.08 ether}(address(1));
      uint256 slotBalance = stdstore
          .target(address(nft))
          .sig(nft.balanceOf.selector)
          .with_key(address(1))
          .find();

      uint256 balanceFirstMint = uint256(
          vm.load(address(nft), bytes32(slotBalance))
      );
      assertEq(balanceFirstMint, 1);

      nft.mintTo{value: 0.08 ether}(address(1));
      uint256 balanceSecondMint = uint256(
          vm.load(address(nft), bytes32(slotBalance))
      );
      assertEq(balanceSecondMint, 2);
  }
```

Introduce the fuzz config flag `no_zksync_reserved_addresses` that can be set to offset all `proptest`
generated system reserved addresses by `65536` so they fall in the valid address range.

We explicitly avoid using `prop_filter` as it can cause the same "too many rejections" failure in `proptest`,
and instead opt to map the invalid addresses in the valid address range, so the fuzzer's *performance is practically unaffected*.

A side-effect of this is that `address(0)` would no longer be the boundary value. However, since we support foundry's
[inline test config](https://book.getfoundry.sh/reference/config/inline-test-config) the option can be selectively applied on certain tests as required.

## Contract Size limitations
In ZkEVM, the contract size must be divisible by 32 bytes (4 instructions). For example,  `bytes("mock code")` would fail the `ensure_chunkable` validation.
Additionally, the bytecode cannot exceed `2^16` 32-byte words.

```sol
  function test_RevertUnSafeContractReceiver() public {
      // Address is set to 11, because the first 10 addresses are restricted for precompiles
      vm.etch(address(11), bytes("mock code"));
      vm.expectRevert(bytes(""));
      nft.mintTo{value: 0.08 ether}(address(11));
  }
```

*This will result in the following error:*

> The application panicked (crashed).
Message:  Bytes must be divisible by 32 to split into chunks

## Difference in create2 derived addresses
zkEVM `create2` addresses do not match EVM `create2` addresses.

This is how we compute `create2` addresses in ZKsync:

```sol
  function computeCreate2Address(
          address _sender,
          bytes32 _salt,
          bytes32 _bytecodeHash,
          bytes32 _constructorInputHash
      ) internal pure returns (address) {
          bytes32 senderBytes = bytes32(uint256(uint160(_sender)));
          bytes32 data = keccak256(
              // solhint-disable-next-line func-named-parameters
              bytes.concat(CREATE2_PREFIX, senderBytes, _salt, _bytecodeHash, _constructorInputHash)
          );

          return address(uint160(uint256(data)));
      }
```

## Cheatcodes
We support cheatcodes on the test code (because it is run on the EVM). But we do not support them on contracts that the test creates/invokes
(because they run on the zkVM).
For example, creating a contract that itself calls `vm.assume` is not supported, but using that call at the root level of the test is.

## Issuing a `CALL` to `tx.origin`

In our current implementation, attempts to call the `tx.origin` address will fail.
This is likely due to measures implemented to ensure the calling address can send transactions. Consequently, no contract call may be made to it.

This situation is unlikely and has only been observed in fuzz tests.

```sol
  function testZkCheatcodesCanMockCall(address mockMe) public {
      //zkVM currently doesn't support mocking the transaction sender
      vm.assume(mockMe != tx.origin);

      vm.mockCall(
          mockMe,
          abi.encodeWithSelector(IMyProxyCaller.transact.selector),
          abi.encode()
      );

      MyProxyCaller transactor = new MyProxyCaller();
      transactor.transact(mockMe);
  }
```

Recomendation is to use `vm.assume` and confirm that any address being called is not identical to `tx.origin`.

---
title: Call
description:
---

All EVM call instructions are handled similarly.

The call type is encoded on the assembly level, so we will describe the common handling workflow, mentioning distinctions if there are any.

For more information, see the
[ZKsync Era documentation](/build/developer-reference/ethereum-differences/evm-instructions).

## CALL

Original [EVM](https://www.evm.codes/#f1?fork=shanghai) instruction.

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

The code checks if the call is non-static and the Ether value is non-zero. If so, the call is redirected to the [MsgValueSimulator](/zk-stack/components/compiler/specification/system-contracts#ether-value-simulator).

- [EraVM instruction: `call` (near call)](https://matter-labs.github.io/eravm-spec/spec.html#NearCallDefinition)
- [EraVM instruction: `far_call`](https://matter-labs.github.io/eravm-spec/spec.html#FarCalls)

## DELEGATECALL

Original [EVM](https://www.evm.codes/#f4?fork=shanghai) instruction.

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

[EraVM instruction: `far_call`](https://matter-labs.github.io/eravm-spec/spec.html#FarCalls)

## STATICCALL

Original [EVM](https://www.evm.codes/#fa?fork=shanghai) instruction.

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/call.rs#L530)
is common for Yul and EVMLA representations.

[EraVM instruction: `far_call`](https://matter-labs.github.io/eravm-spec/spec.html#FarCalls)

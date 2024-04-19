---
title: Block
description:
---

## BLOCKHASH

Original [EVM](https://www.evm.codes/#40?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L47)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## COINBASE

Original [EVM](https://www.evm.codes/#41?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L150)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## TIMESTAMP

Original [EVM](https://www.evm.codes/#42?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L98)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## NUMBER

Original [EVM](https://www.evm.codes/#43?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L81)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## PREVRANDAO

Original [EVM](https://www.evm.codes/#44?fork=shanghai) instruction. | DIFFICULTY

Original [EVM](https://www.evm.codes/#44?fork=grayGlacier)

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L133)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## GASLIMIT

Original [EVM](https://www.evm.codes/#45?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L13)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## CHAINID

Original [EVM](https://www.evm.codes/#46?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L64)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

## SELFBALANCE

Original [EVM](https://www.evm.codes/#47?fork=shanghai) instruction.

Implemented as [BALANCE](environment#balance) with an [ADDRESS](environment#address) as its argument.

## BASEFEE

Original [EVM](https://www.evm.codes/#48?fork=shanghai) instruction.

### System Contract

This information is requested a System Contract called [SystemContext](https://github.com/matter-labs/era-system-contracts/blob/main/contracts/SystemContext.sol).

On how the System Contract is called, see [this section](../../system-contracts#environmental-data-storage).

### LLVM IR

[The LLVM IR generator code](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/evm/context.rs#L167)
is common for Yul and EVMLA representations.

The request to the System Contract is done via the
[SystemRequest](https://github.com/matter-labs/era-compiler-llvm-context/blob/main/src/eravm/context/function/runtime/system_request.rs) runtime function.

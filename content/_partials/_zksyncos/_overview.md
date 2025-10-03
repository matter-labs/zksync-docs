---
title: ZKsync OS Overview
description: Introduction to ZKsync OS
---

ZKsync OS is a system-level implementation for ZKsync's state transition function.
Under ZKsync's new architecture, execution is decoupled from proving.
ZKsync OS acts as the operation layer in this new architecture.
It takes block data and an initial state as input and computes the
new state after the application of the block.

ZKsync OS is implemented as a Rust program that will be compiled to two targets. This first one, x86, is used for running in the sequencer.
The second, RISC-V, is fed as an input to the [ZKsync Airbender](/zk-stack/components/zksync-airbender)
prover to produce the validity proof of the state transition.

## Components of ZKsync OS

ZKsync OS is designed to support multiple VMs.
The main components of ZKsync OS are:

- [**Bootloader**](/zksync-protocol/zksyncos/bootloader): The entry point program. It initializes the system and then
runs transactions using two components: the system and the execution environment interpreters.
- [**Execution Environments**](/zksync-protocol/zksyncos/execution-environment): Regular interpreters that take bytecode,
calldata, resources (similar to gas) and some other call context values
as its input. Interpreters are instantiated with some local state to execute a frame. When an interpreter sees a call to another contract,
return/revert from current frame, or contract creation it triggers special functionality to process it, as a potentially different
interpreter should be run.
- [**System**](/zksync-protocol/zksyncos/system): Common for all environments and the bootloader. Provides an abstract interface for
low-level handling of IO (storage, events,
L1 messages, oracles) and memory management. The system communicates with the external oracle (non-determinism source), which is needed to read block data
, and also for some IO operations, e.g. to perform the initial read for a storage slot.

::centered-container
![zksyncOS.png](/images/zksyncos-airbender/zksyncOS.png)
::

This modular design enables us to isolate a minimal interface required to implement an Execution Environment. In addition, the system abstraction
makes the storage model customizable and allows for different instances of the entire system.

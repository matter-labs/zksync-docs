---
title: Quickstart - Contract code
---

## Review the smart contract code

The smart contract will store messages from users and emit events with replies from Zeek.
The entire code is as follows:

:test-action{actionId="add-zeek-messages-contract"}

```solidity
:code-import{filePath="zksync-os/contracts/ZeekMessages.sol"}
```

The Solidity smart contract contains three functions:

- `sendMessage` stores the messages sent by users in the `messages` state variable.
- `getTotalMessages` returns the number of messages stored in the smart contract.
- `getLastMessage` returns the last message sent.

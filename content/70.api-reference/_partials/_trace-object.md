---
title: Trace Object
---

#### Trace Object

::collapsible

- **type**: String - The type of operation (e.g., `Call`, `Create`, etc.), indicating the nature of the trace.
- **from**: DATA, 20 bytes - address of the account that initiated the operation.
- **to**: DATA, 20 bytes - recipient address of the call.
For `Create` operations, this field is absent as the contract being created doesn't have an address until after the transaction completes.
- **gas**: QUANTITY, 32 bytes - amount of gas provided for the operation.
- **gasUsed**: QUANTITY, 32 bytes - amount of gas used by the operation.
- **value**: QUANTITY, 32 bytes - amount of Ether transferred during the operation.
- **output**: DATA - output from the operation. For operations that don't return data or failed, this is typically `0x`.
- **input**: DATA - data sent into the call or contract creation.
- **error**: String - error message if the operation failed.
- **revertReason**: String - reason provided by a `revert` operation, if applicable.
- **calls**: Array\<Object\> - array of nested calls made by this operation. This field is recursive,
containing further traces of calls made by the traced operation.
::

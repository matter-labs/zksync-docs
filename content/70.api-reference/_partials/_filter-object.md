---
title: Filter Object
---

**Filter** - Object containing various fields to specify the criteria for filtering events

::collapsible

- **fromBlock**: QUANTITY | TAG - The starting block (inclusive) to filter events from. Default is `"latest"`.
- **toBlock**: QUANTITY | TAG - The ending block (inclusive) to filter events up to. Default is `"latest"`.
- **address**: DATA | Array, 20 bytes - The contract address(s) to filter events from.
- **topics**: Array of Data - An array of topics to filter events by.
Each element can be a topic to match, or `null` to match any topic in that position.
- **blockHash**: DATA, 32 bytes - Filters events from a specific block hash, only allowing a single block to be specified.
Note that using `blockHash` will override any specified `fromBlock` and `toBlock` fields.
::

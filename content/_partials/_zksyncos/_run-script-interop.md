---
title: Hardhat 3 Run Script
---

9. Run the script <!-- markdownlint-disable-line -->

        ::code-group

        ```bash [npm]
        npx hardhat run scripts/interop-counter.ts
        ```

        ```bash [yarn]
        yarn hardhat run scripts/interop-counter.ts
        ```

        ```bash [pnpm]
        pnpm hardhat run scripts/interop-counter.ts
        ```

        ```bash [bun]
        bun hardhat run scripts/interop-counter.ts
        ```

        ::

You should see the script output:

```txt
Counter deployed on localZKsyncOSChain2 at: 0x...
StartingNumber:  1n
✅ Created interop transaction.
✅ Bundle is finalized on source; root available on destination.
Finalize result: {
  bundleHash: '0x...',
  dstExecTxHash: '0x...'
}
FinalNumber:  2n
```

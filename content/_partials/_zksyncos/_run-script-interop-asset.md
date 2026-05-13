---
title: Hardhat 3 Run Asset Transfer Script
---

16. Run the script. <!-- markdownlint-disable-line -->

        ::code-group

        ```bash [npm]
        npx hardhat run scripts/interop-asset-transfer.ts
        ```

        ```bash [yarn]
        yarn hardhat run scripts/interop-asset-transfer.ts
        ```

        ```bash [pnpm]
        pnpm hardhat run scripts/interop-asset-transfer.ts
        ```

        ```bash [bun]
        bun hardhat run scripts/interop-asset-transfer.ts
        ```

        ::

You should see output similar to this:

```txt
Using InteropToken on localZKsyncOSChain1 at: 0x...
SourceBalance: 100000000000000000000n
✅ Created interop transaction.
✅ Bundle is finalized on source; root available on destination.
Finalize result: {
  bundleHash: '0x...',
  dstExecTxHash: '0x...'
}
```

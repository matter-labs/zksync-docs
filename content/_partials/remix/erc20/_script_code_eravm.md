---
title: Interact EraVM Code - ERC20 with Remix
---

```typescript
:code-import{filePath="hardhat-sol/scripts/mint-token.ts:start"}
  // Note that the script needs the ABI which is generated from the compilation artifact.
  // Make sure contract is compiled for ZKsync and artifacts are generated
  const artifactsPath = `browser/artifacts/contracts/TestToken.sol/TestToken.json`;

  const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath));

  const signer = (new ethers.BrowserProvider(web3Provider)).getSigner(0);

:code-import{filePath="hardhat-sol/scripts/mint-token.ts:end"}
```

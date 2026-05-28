# Local Interop Demo for Foundry

## Scripts

- `script/InteropCounterDeploy.s.sol`
  - `InteropCounterDeploy`: deploys `InteropCounter` on chain `6566` and calls `inc()`.
- `script/InteropCounterSendBundle.s.sol`
  - `InteropCounterSendBundle`: sends the interop bundle on chain `6565`.
- `script/InteropCounterFinalizeBundle.s.sol`
  - `InteropCounterFinalizeBundle`: finalizes on chain `6566`.
  - `run(address,bytes)` with only `proofEncoded` (bundle is derived from `proof.message.data`).

## Example runs

```bash
# 1) deploy counter on chain 6566
forge script script/InteropCounterDeploy.s.sol:InteropCounterDeploy \
  --rpc-url http://localhost:3051 \
  --broadcast \
  --skip-simulation

# 2) send bundle from chain 6565 (replace <COUNTER_ADDRESS>)
forge script script/InteropCounterSendBundle.s.sol:InteropCounterSendBundle \
  --sig "run(address)" <COUNTER_ADDRESS> \
  --rpc-url http://localhost:3050 \
  --broadcast \
  --skip-simulation \
  --gas-estimate-multiplier 1000

# 3) get the proof encoded hex
PROOF_ENCODED_HEX=$(./script/get-proof-encoded.sh 0x5d1d111f4354af7ace415b1deac201c254fcdebbe3426055c35d483b5d0020fd)

# 3) finalize on chain 6566 with only proof (replace COUNTER_ADDRESS, PROOF_ENCODED_HEX)
forge script script/InteropCounterFinalizeBundle.s.sol:InteropCounterFinalizeBundle \
  --sig "run(address,bytes)" COUNTER_ADDRESS $PROOF_ENCODED_HEX \
  --rpc-url http://localhost:3051 \
  --broadcast \
  --skip-simulation
```

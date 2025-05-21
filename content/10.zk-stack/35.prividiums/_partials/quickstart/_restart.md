---
title: Quickstart - Restarting your chain
description: How to restart your prividium chain
---

If at some point during development you wish to stop and restart your chain,
here is what you'll need to do to restart it.

From the ecosystem folder:

1. Run `zkstack containers` to restart the L1 and postgres Docker containers.
  If you have deleted the containers, go through the initial ecosystem setup steps again.
1. Run `zkstack server` to start the standard RPC API.
1. In a new terminal, run `zkstack private-rpc run`.
1. In another terminal, run `zkstack contract-verifier run`.
1. In another terminal, run `zkstack explorer backend` and then `zkstack explorer run`.

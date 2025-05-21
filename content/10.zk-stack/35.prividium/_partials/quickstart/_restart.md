---
title: Quickstart - Restarting your chain
description: How to restart your Prividium chain
---

If at some point during development you wish to stop and restart your chain,
here are the complete steps for restarting.

To restart the chain and RPC APIs, go to the ecosystem folder and:

1. Run `zkstack containers` to restart the L1 and postgres Docker containers.
  If you have deleted the containers, go through the initial ecosystem setup steps again.
1. Run `zkstack server` to start the standard RPC API.
1. In a new terminal, run `zkstack private-rpc run`.

For the admin block explorer:

1. In another terminal, run `zkstack contract-verifier run`.
1. In another terminal, run `zkstack explorer backend`.
1. In another terminal, run `zkstack explorer run`.

For the public-facing block explorer with user authentication:

TODO: add here

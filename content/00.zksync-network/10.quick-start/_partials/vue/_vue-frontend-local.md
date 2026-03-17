---
title: Quickstart - Vue Frontend Local
---

:display-partial{path="/zksync-network/quick-start/_partials/vue/_shared-setup"}

6. Create a `.env` file and add your deployed contract address as `VITE_CONTRACT_ADDRESS` and set `VITE_CHAIN` to `local`.  <!-- markdownlint-disable-line -->

    :test-action{actionId="create-vue-env-file"}
    :test-action{actionId="set-vue-frontend-contract-address"}
    :test-action{actionId="set-vue-frontend-chain"}

    ```txt
    VITE_CONTRACT_ADDRESS=0x...
    VITE_CHAIN=local
    ```

:display-partial{path="/zksync-network/quick-start/_partials/vue/_shared-setup-2"}

:display-partial{path="/zksync-network/quick-start/_partials/_local-funds"}

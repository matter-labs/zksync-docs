---
title: Quickstart - React Frontend Local
---

:display-partial{path="/zksync-network/quick-start/_partials/react/_shared-setup"}

6. Create a `.env` file in the root of the `token-frontend` folder, add your deployed contract address as `VITE_CONTRACT_ADDRESS`, and set `VITE_CHAIN` to `local`.  <!-- markdownlint-disable-line -->

    :test-action{actionId="create-react-env-file"}
    :test-action{actionId="set-react-frontend-contract-address"}
    :test-action{actionId="set-react-frontend-chain"}

    ```txt
    VITE_CONTRACT_ADDRESS=0x...
    VITE_CHAIN=local
    ```

:display-partial{path="/zksync-network/quick-start/_partials/react/_shared-setup-2"}

:display-partial{path="/zksync-network/quick-start/_partials/_local-funds"}

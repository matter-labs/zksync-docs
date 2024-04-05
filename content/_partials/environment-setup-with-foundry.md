---
title: Foundry-zksync Installation
---

::drop-panel
  ::panel{label="Install foundry-zksync"}
   Begin by installing `foundry-zksync` in your environment using the command below:

    ```
    curl -L https://foundry-zksync.zksync.io | bash
    ```
  ::

  ::panel{label="Setup local node (optional)"}
  Leveraging **zksync-cli** to set up
  a local development environment is a beneficial next step.
  This local setup allows for quicker testing and debugging
  processes without incurring testnet transaction costs.

  **Prerequisites:**

  **Docker Installation:** **zksync-cli**'s local environment relies on Docker.
  Download the appropriate version from the Docker website.
  If you're new to Docker, consider exploring the Docker getting started guide.

  1. **Open Your Terminal:** Access it from the Applications folder or use Spotlight search (Command + Space).
  2. **Initialize Local zkSync Node:**
      - Run the command: **npx zksync-cli@latest dev start**
      - When prompted, choose “In memory node” to deploy a local zkSync node in a Docker container.
  3. **Access Rich Accounts:** For pre-configured rich wallets, visit [era-test-node rich wallets](https://era.zksync.io/docs/tools/testing/era-test-node.html#use-pre-configured-rich-wallets).
  4. **Local Node URL:** Your local zkSync node is accessible at
  **[http://127.0.0.1:8011](http://127.0.0.1:8011/)**, ready for deployment or testing purposes.
  ::

  ::panel{label="Initialize project"}
  Run the following command in your terminal to create a new Foundry project using `foundry-zksync`.

    ```sh
    forge init --template https://github.com/dutterbutter/zksync-foundry-quickstart-guide
    ```

  ::
::

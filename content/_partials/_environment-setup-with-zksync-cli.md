---
title: Environment Setup With zkSync CLI
---

::drop-panel
  ::panel{label="Install Node.js or Bun.sh"}
  To effectively utilize the **zksync-cli** tool, your
  development environment needs to be set up with either Node.js or Bun.sh.
  The choice depends on your project's requirements and personal preference for package management and execution speed.

    - Node.js
        - Download the Long-Term Support (LTS) version from the [official Node.js website](https://nodejs.org/en/download).
        - For first-time users, the [Node.js usage guide](https://nodejs.org/api/synopsis.html#usage) offers comprehensive instructions on getting started.
    - Bun.sh
        - Obtain the latest version from the [Bun installation page](https://bun.sh/docs/installation). Bun.sh is known for its high performance and modern JavaScript features.
  ::

  ::panel{label="Setup local node (optional)"}
  After installing Node.js or Bun, leveraging **zksync-cli** to set up
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

::

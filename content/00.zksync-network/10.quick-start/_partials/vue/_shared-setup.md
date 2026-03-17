---
title: Quickstart - Vue Frontend Setup
---

1. Create a Vite Vue project.

    :test-action{actionId="create-vue-frontend-project"}

    ::code-group

    ```bash [npm]
    npm create vite@latest zeek-frontend-vue -- --template vue-ts --no-interactive
    ```

    ```bash [yarn]
    yarn create vite zeek-frontend-vue --template vue-ts --no-interactive
    ```

    ```bash [pnpm]
    pnpm create vite zeek-frontend-vue --template vue-ts --no-interactive
    ```

    ```bash [bun]
    bun create vite zeek-frontend-vue --template vue-ts --no-interactive
    ```

    ::

1. Move into the project folder and install the required packages.

    :test-action{actionId="move-into-vue-frontend-project"}

    ```bash
    cd zeek-frontend-vue
    ```

    :test-action{actionId="install-vue-frontend-deps"}

    ::code-group

    ```bash [npm]
    npm install
    npm install @wagmi/vue viem@2.x @tanstack/vue-query
    ```

    ```bash [yarn]
    yarn install
    yarn add @wagmi/vue viem@2.x @tanstack/vue-query
    ```

    ```bash [pnpm]
    pnpm install
    pnpm add @wagmi/vue viem@2.x @tanstack/vue-query
    ```

    ```bash [bun]
    bun install
    bun add @wagmi/vue viem@2.x @tanstack/vue-query
    ```

    ::

1. Create file in the `src` folder called `wagmi.ts` and copy/paste the config below.

    :test-action{actionId="create-vue-wagmi-file"}
    :test-action{actionId="add-vue-wagmi-config"}

    ```ts
    :code-import{filePath="zeek-frontend-vue/src/wagmi.ts"}
    ```

1. Next, configure the `wagmi` plugin and query client in `src/main.ts`.

    :test-action{actionId="configure-vue-main-file"}

    ```ts
    :code-import{filePath="zeek-frontend-vue/src/main.ts"}
    ```

1. Replace `src/App.vue` with the code below.

    :test-action{actionId="open-app-vue"}
    :test-action{actionId="replace-vue-app-file"}

    ::drop-panel

    ::panel{label="App.vue"}

   ```ts
    :code-import{filePath="zeek-frontend-vue/src/App.vue"}
    ```

    ::

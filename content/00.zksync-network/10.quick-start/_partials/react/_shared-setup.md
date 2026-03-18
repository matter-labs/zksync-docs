---
title: Quickstart - React Frontend Setup
---

1. Create a Vite React project.

    :test-action{actionId="create-react-frontend-project"}

    ::code-group

    ```bash [npm]
    npm create vite@latest token-frontend -- --template react-ts --no-interactive
    ```

    ```bash [yarn]
    yarn create vite token-frontend --template react-ts --no-interactive
    ```

    ```bash [pnpm]
    pnpm create vite token-frontend --template react-ts --no-interactive
    ```

    ```bash [bun]
    bun create vite token-frontend --template react-ts --no-interactive
    ```

    ::

1. Move into the project folder and install the required packages.

    :test-action{actionId="move-into-react-frontend-project"}

    ```bash
    cd token-frontend
    ```

    :test-action{actionId="install-react-frontend-deps"}

    ::code-group

    ```bash [npm]
    npm install
    npm install wagmi viem@2.x @tanstack/react-query
    ```

    ```bash [yarn]
    yarn install
    yarn add wagmi viem@2.x @tanstack/react-query
    ```

    ```bash [pnpm]
    pnpm install
    pnpm add wagmi viem@2.x @tanstack/react-query
    ```

    ```bash [bun]
    bun install
    bun add wagmi viem@2.x @tanstack/react-query
    ```

    ::

1. Create file in the `src` folder called `wagmi.ts` and copy/paste the config below.

    :test-action{actionId="create-react-wagmi-file"}
    :test-action{actionId="add-react-wagmi-config"}

    ```ts
    :code-import{filePath="token-frontend-react/src/wagmi.ts"}
    ```

1. Next, configure the `wagmi` and query client providers in `src/main.tsx`.

    :test-action{actionId="configure-react-main-file"}

    ```ts
    :code-import{filePath="token-frontend-react/src/main.tsx"}
    ```

1. Replace `src/App.tsx` with the code below.

    :test-action{actionId="open-app-tsx"}
    :test-action{actionId="replace-react-app-file"}

    ::drop-panel

   ::panel{label="App.tsx"}

   ```ts
    :code-import{filePath="token-frontend-react/src/App.tsx"}
    ```

    ::

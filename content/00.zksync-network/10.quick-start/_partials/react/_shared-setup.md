---
title: Quickstart - React Frontend Setup
---

1. Create a Vite React project.

    ::code-group

    ```bash [npm]
    npm create vite@latest zeek-frontend -- --template react-ts --no-interactive
    ```

    ```bash [yarn]
    yarn create vite zeek-frontend --template react-ts --no-interactive
    ```

    ```bash [pnpm]
    pnpm create vite zeek-frontend --template react-ts --no-interactive
    ```

    ```bash [bun]
    bun create vite zeek-frontend --template react-ts --no-interactive
    ```

    ::

1. Move into the project folder and install the required packages.

    ```bash
    cd zeek-frontend
    ```

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

    ```ts
    :code-import{filePath="zeek-frontend-react/src/wagmi.ts"}
    ```

1. Next, configure the `wagmi` and query client providers in `src/main.tsx`.

    ```ts
    :code-import{filePath="zeek-frontend-react/src/main.tsx"}
    ```

1. Replace `src/App.tsx` with the code below.

    ::drop-panel

    ::panel{label="App.tsx"}

   ```ts
    :code-import{filePath="zeek-frontend-react/src/App.tsx"}
    ```

    ::

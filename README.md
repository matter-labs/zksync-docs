# 🌟 zkSync Developer Documentation

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange)

Welcome to the **zkSync Docs** repository! This is your go-to hub for all things
zkSync. Dive into our comprehensive documentation whether you're just starting out or looking for advanced guides.

## 🚀 Quick Start

1. **Install Bun:** Follow the [installation instructions](https://bun.sh/docs/installation).
2. **Install Dependencies:**

   ```sh
   bun install
   ```

3. **Run Locally:** Start the development server at `http://localhost:3000`.

   ```sh
   bun run dev
   ```

## 📚 Documentation Overview

Unlock the full potential of zkSync with our comprehensive resources:

- **🛠️ Build:** Learn how to develop and deploy your smart contracts and
applications on zkSync Era. Our step-by-step guides and tutorials will help you get started quickly and efficiently.
  
- **🔗 ZK Stack:** Dive into the Zero-Knowledge (ZK) Stack to discover how to
configure and build a ZK chain tailored for your application. Explore the architecture, components, and best practices.

- **🌐 zkSync Node:** Set up and run your own zkSync full node. Gain a deeper
understanding of node operations, observability, and maintenance to ensure optimal performance and reliability.

- **🌍 Ecosystem:** Explore the vibrant zkSync ecosystem. Discover a wide array
of projects and tooling built for zkSync developers and users, from wallets and
explorers to integrations and developer tools. Stay updated with the latest innovations and community contributions.

## 🛠️ Built With

- [Vue](https://vuejs.org/)
- [Nuxt](https://nuxt.com/)
- [Nuxt Content](https://content.nuxt.com/)
- [Nuxt UI & Nuxt UI Pro](https://ui.nuxt.com/)
- [Tailwind](https://tailwindcss.com/)
- [Bun](https://bun.sh/)

## 🖥️ Local Development

Run the project locally:

```sh
bun run dev
```

## Local Preview 👀

To locally preview the production build, first run `bun run build` to build the project, then run the following:

```shell
bun run preview
```

## Lint & Formatting ✨

This project provides lint commands to check the project.

### Run CI Checks ✔️

```shell
bun run ci:check
```

### Markdown Linting 📝

Markdown files are found in the `/content` directory. The following lint commands will run within that directory:

```shell
bun run lint:spelling
bun run lint:markdown
```

### Linting 🧹

The following commands are available to run linting on the project:

```shell
bun run lint:prettier
bun run lint:eslint
```

## 📜 Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification.
Make sure your commit messages adhere to these guidelines.

## 🤝 Contributions

We welcome contributions from the community! Check out the following resources to get started:

- [Contribution Overview](./content/00.build/90.contributing-to-documentation/10.index.md)
- [Contribution Guidelines](./content/00.build/90.contributing-to-documentation/20.contribution-guidelines.md)
- [Documentation Styleguide](./content/00.build/90.contributing-to-documentation/30.documentation-styleguide.md)

Join us in making zkSync Docs better for everyone! 🌐✨

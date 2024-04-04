# ZK Sync Docs

Welcome to the ZK Sync Docs repository. This project serves as the community hub for zkSync, providing comprehensive
documentation for developers. Whether you're a beginner looking to get started with zkSync or an experienced developer
seeking advanced guides, you'll find the resources you need here.

## Tools used

- [Vue](https://vuejs.org/)
- [Nuxt](https://nuxt.com/)
- [NuxtContent](https://content.nuxt.com/)
- [NuxtUI & NuxtUI Pro](https://ui.nuxt.com/)
- [Tailwind](https://tailwindcss.com/)
- [Bun](https://bun.sh/)

## Local Setup

This project uses bun to run, follow the [bun installation instructions](https://bun.sh/docs/installation). Once bun is
installed, run the following command to install all project dependencies:

```shell
bun install
```

## Development

To run the project locally at `http://localhost:3000`

```shell
bun run dev -o
```

## Local Preview

To locally preview the production build:

```shell
bun run preview
```

## Lint & Formatting

This project provides lint commands to check the project.

### Markdown Linting

Markdown files are found in the `/content` directory. The following lint commands will run within that directory:

```shell
bun run lint:spelling
bun run lint:markdown
```

### Linting

The following commands are available to run linting on the project:

```shell
bun run lint:prettier
bun run lint:eslint
```

## Contributions

We welcome contributions from the community to zkSync Docs.
If you're looking for ideas on where to start with contributing, check out the [Contribution Overview](./content/90.contributing-to-documentation/10.index.md).
To learn more on how to follow best practices when contributing to zkSync Docs,
refer to the [Contribution Guidelines](./content/90.contributing-to-documentation/20.contribution-guidelines.md).
If you are writing new content to add to the docs, the [Documentation Styleguide](./content/90.contributing-to-documentation/30.documentation-styleguide.md)
can provide additional guidance.

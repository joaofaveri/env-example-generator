# EnvExampleGenerator

[![npm version](https://badge.fury.io/js/env-example-generator.svg)](https://badge.fury.io/js/env-example-generator)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**EnvExampleGenerator: Simplify Environment Variable Management.** Generate `.env.example` files by extracting keys from your existing `.env` files, removing sensitive values, and ensuring consistent configurations across your team. Streamline project setup and improve onboarding with a single command.

## Usage (Recommended)

You can run EnvExampleGenerator directly using `npx` (or the equivalent for Yarn and pnpm):

<Tabs>
<Tab title="npx">
```bash
npx env-example-generator [options]
```
</Tab>
<Tab title="yarn">
```bash
yarn env-example-generator [options]
```
</Tab>
<Tab title="pnpm">
```bash
pnpm env-example-generator [options]
```
</Tab>
</Tabs>

## Installation (Optional)
If you prefer, you can install EnvExampleGenerator globally or locally:

<Tabs>
<Tab title="npm">
```bash
npm install -g env-example-generator # Global
npm install env-example-generator # Local
```
</Tab>
<Tab title="yarn">
```bash
yarn global add env-example-generator # Global
yarn add env-example-generator # Local
```
</Tab>
<Tab title="pnpm">
```bash
pnpm install -g env-example-generator # Global
pnpm install env-example-generator # Local
```
</Tab>
</Tabs>

## Options
-i, --input <file>: Path to the input .env file. Default: .env, .env.local, .env.development, .env.production.
-o, --output <file>: Path to the output .env.example file. Default: .env.example.
-t, --typescript: Generate the env.d.ts file with type definitions.
-r, --remove-comments: Remove comments from the .env.example file.
-I, --interactive: Interactive mode.
-c, --include-comments: Include comments from the .env file in the .env.example file.
-d, --delimiter <delimiter>: Delimiter used in the .env file. Default: =.

## Examples
# Generate .env.example and env.d.ts files
```bash
npx env-example-generator -i .env -o .env.example -t
```

## Use interactive mode
```bash
npx env-example-generator -I
```

## Include comments and use a custom delimiter
```bash
npx env-example-generator -i .env -o .env.example -c -d ':'
```

# Contributing
Contributions are welcome! Feel free to open issues and pull requests.

# License
MIT

# Author
@joaofaveri João Paulo de Faveri

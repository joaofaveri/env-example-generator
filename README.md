# Production-Ready TypeScript Package Template

This repository provides a basic template for creating Node.js packages with TypeScript, Jest, and ESLint.

## Features

* **TypeScript:** The project is configured to use TypeScript, ensuring static typing and improving code quality.
* **Jest:** Unit tests are configured with Jest to ensure code reliability.
* **ESLint:** ESLint is configured to maintain code consistency and follow best practices.
* **Simplified Configuration:** The template offers a simplified initial configuration to facilitate the development of new packages.
* **Husky:** Configured to run scripts on Git hooks.
* **lint-staged:** Configured to run linters on staged files.
* **commitlint:** Configured to enforce conventional commit message formats.
* **release-it:** Configured to automate package releases.

## How to Use

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/joaofaveri/template-package.git
    cd template-package
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Develop:**

    * Modify the `src/` files with your package's code.
    * Create unit tests in `tests/`.

4.  **Run tests:**

    ```bash
    npm run test
    ```

5.  **Build the package:**

    ```bash
    npm run build
    ```

6.  **Publish the package (optional):**

    ```bash
    npm run release
    ```

## Configurations

* **TypeScript:** TypeScript settings can be adjusted in the `tsconfig.json` file.
* **Jest:** Jest settings can be adjusted in the `jest.config.js` file.
* **ESLint:** ESLint settings can be adjusted in the `.eslintrc.json` file.
* **Husky:** Husky settings can be adjusted in the `.husky` directory and `package.json` file.
* **lint-staged:** lint-staged settings can be adjusted in the `package.json` and `.lintstagedrc.json` files.
* **commitlint:** commitlint settings can be adjusted in the `commitlint.config.js` file.
* **release-it:** release-it settings can be adjusted in the `.release-it.ts` and `changelog.config.cjs` files.

### commitlint

* The `commitlint.config.js` file allows you to customize the commit message format.
    * It uses the `conventional-changelog-conventionalcommits` preset, which enforces a standardized commit message format.
    * You can define rules to enforce specific conventions for commit message headers, scopes, and types.
    * **Available Rules:**
        * `header-case`: Enforces the case of the commit header (e.g., lowercase, uppercase).
        * `header-full-stop`: Enforces or prohibits a full stop at the end of the commit header.
        * `header-max-length`: Enforces a maximum length for the commit header.
        * `header-min-length`: Enforces a minimum length for the commit header.
        * `body-case`: Enforces the case of the commit body.
        * `body-full-stop`: Enforces or prohibits a full stop at the end of the commit body.
        * `body-leading-blank`: Enforces or prohibits a leading blank line for the commit body.
        * `body-max-line-length`: Enforces a maximum line length for the commit body.
        * `body-min-line-length`: Enforces a minimum line length for the commit body.
        * `footer-case`: Enforces the case of the commit footer.
        * `footer-full-stop`: Enforces or prohibits a full stop at the end of the commit footer.
        * `footer-leading-blank`: Enforces or prohibits a leading blank line for the commit footer.
        * `footer-max-line-length`: Enforces a maximum line length for the commit footer.
        * `footer-min-line-length`: Enforces a minimum line length for the commit footer.
        * `scope-case`: Enforces the case of the commit scope.
        * `scope-empty`: Enforces or prohibits an empty commit scope.
        * `scope-enum`: Enforces specific values for the commit scope.
        * `scope-max-length`: Enforces a maximum length for the commit scope.
        * `scope-min-length`: Enforces a minimum length for the commit scope.
        * `subject-case`: Enforces the case of the commit subject.
        * `subject-empty`: Enforces or prohibits an empty commit subject.
        * `subject-full-stop`: Enforces or prohibits a full stop at the end of the commit subject.
        * `subject-max-length`: Enforces a maximum length for the commit subject.
        * `subject-min-length`: Enforces a minimum length for the commit subject.
        * `type-case`: Enforces the case of the commit type.
        * `type-empty`: Enforces or prohibits an empty commit type.
        * `type-enum`: Enforces specific values for the commit type.
    * Example: Enforce a specific format for commit message headers.

### lint-staged

* The `lint-staged` configuration in `.lintstagedrc.json` defines which linters to run on staged files.
    * All staged files will be checked by `eslint --fix` to automatically fix linting errors.
    * You can specify different linters for different file types.
    * Example: Run ESLint on staged `.ts` files and Prettier on staged `.js` and `.json` files.

### Changelog

* The `release-it` configuration in `.release-it.ts` automates changelog generation.
    * It uses `@release-it/conventional-changelog` and `conventionalcommits` preset to generate a changelog based on commit messages.
    * The `template` folder contains templates for changelog generation, allowing for customization of the output format.
    * You can customize the changelog format and content.
* When using `release-it` the changelog is auto generated during releases.
* For a better commit prompt experience, this package use `commitizen` and `git-cz` to trigger the interactive commit prompt.
* The `changelog.config.cjs` file allows you to configure the commit prompt, including possible scopes.

## Scripts

* `npm run build`: Compiles TypeScript code to JavaScript.
* `npm run test`: Runs unit tests with Jest.

## Contribution

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
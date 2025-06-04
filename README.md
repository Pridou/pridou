<h1 align="center">
  <br>
  <a href="https://github.com/Pridou/pridou"><img src="./.github/assets/logo.png" width="200" alt="Pridou"></a>
  <br>
  Pridou
  <br>
</h1>

<p align="center">The pridou interpreter.</p>

<p align="center">
  <a href="#-getting-started">Getting started</a> •
  <a href="#%EF%B8%8F-how-to-use">How to use</a> •
  <a href="#%EF%B8%8F-roadmap">Roadmap</a> •
  <a href="#-resources">Resources</a> •
  <a href="#-contributors">Contributors</a>
</p>

[![Version][version-shield]][version-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# 🚀 Getting started

-   ## 📦 Prerequisites

    -   🖥️ [NodeJS](https://nodejs.org/) (>= 20.0.0)
    -   🧩 [Npm](https://www.npmjs.com/) (>= 10.0.0)
    -   🐙 [Git](https://git-scm.com/) (\*)

-   ## ⚙️ Installation

    -   First **clone** the project

        ```bash
        git clone https://github.com/Pridou/pridou.git
        cd pridou
        ```

    -   Then **install** the dependencies required to run the project

        ```bash
        npm install
        ```

    -   And finally **launch** the cli with the command below !

        ```bash
        npx pridou
        ```

-   ## 🔧 Configuration (optional)

    -   You can **modify** the [`buildin.ts`](./src/config/builtin.ts) if you want to add native constants or functions

        ```ts
        export const NATIVE_CONSTANTS;
        export const NATIVE_FUNCTIONS;
        ...
        ```

    -  You can modify the [`lexer.ts`](./src/config/lexer.ts) if you want to add new tokens
        ```ts
        export const SKIPPED_TOKENS;
        export const CLASSIC_TOKENS;
        export const RESERVED_TOKENS;
        ...
        ```

    - And you can also modify the [`parser.ts`](./src/config/parser.ts) if you want to add new binary operators
        ```ts
        export const MULTIPLICATIVE_OPERATORS;
        export const ADDITIVE_OPERATORS;
        export const COMPARISON_OPERATORS;
        export const ASSIGNMENT_OPERATORS;
        ...
        ```

# 🛠️ How to use

- ## 📦 Install
    First install Pridou in your project with:

    ```bash
    npm install pridoujs
    ```

- ## 📝 Example usage
    Then you can use Pridou as a library in your own Node.js project:

    ```js
    import Pridou, { Environment } from "pridoujs";

    const code = `
        mut a = 1 + 2;
        ret a;
    `;

    const env = new Environment(); // optional
    const interpreter = new Pridou(env);
    const result = interpreter.eval(code); // or interpreter.run(code)
    console.log(result);
    ```

# 🛤️ Roadmap

-   [x] Project Base
    -   [x] Add biomejs
    -   [x] Add ci
    -   [x] Add vitest

# 📎 Resources

-   📦 [Npm](https://www.npmjs.com/package/pridoujs)

# 🤝 Contributors

<a href="https://github.com/Pridou/pridou/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Pridou/pridou" alt="contrib.rocks image" />
</a>

[version-shield]: https://img.shields.io/github/package-json/v/Pridou/pridou?style=for-the-badge
[version-url]: https://github.com/Pridou/pridou/releases/latest
[contributors-shield]: https://img.shields.io/github/contributors/Pridou/pridou.svg?style=for-the-badge
[contributors-url]: https://github.com/Pridou/pridou/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Pridou/pridou.svg?style=for-the-badge
[forks-url]: https://github.com/Pridou/pridou/network/members
[stars-shield]: https://img.shields.io/github/stars/Pridou/pridou.svg?style=for-the-badge
[stars-url]: https://github.com/Pridou/pridou/stargazers
[issues-shield]: https://img.shields.io/github/issues/Pridou/pridou.svg?style=for-the-badge
[issues-url]: https://github.com/Pridou/pridou/issues
[license-shield]: https://img.shields.io/github/license/Pridou/pridou.svg?style=for-the-badge
[license-url]: https://github.com/Pridou/pridou/blob/main/LICENSE.txt

<!--
Hey, thanks for using the nxan template.  
If you have any enhancements, then fork this project and create a pull request 
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <img src="assets/logo.png" alt="logo" width="200" height="auto" />
  <h1>Nxan Template</h1>

  <p>
    Awesome nx mono repo with NestJS APIs and Angular client! 
  </p>


<!-- Badges -->
<p>
  <a href="https://github.com/kornect/nxan-template/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/kornect/nxan-template" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/kornect/nxan-template" alt="last update" />
  </a>
  <a href="https://github.com/kornect/nxan-template/network/members">
    <img src="https://img.shields.io/github/forks/kornect/nxan-template" alt="forks" />
  </a>
  <a href="https://github.com/kornect/nxan-template/stargazers">
    <img src="https://img.shields.io/github/stars/kornect/nxan-template" alt="stars" />
  </a>
  <a href="https://github.com/kornect/nxan-template/issues/">
    <img src="https://img.shields.io/github/issues/kornect/nxan-template" alt="open issues" />
  </a>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D5.5.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D9.3.0-blue.svg" />
  <img src="https://img.shields.io/badge/nx-%3E%3D15.8.6-blue.svg" />
  <a href="https://github.com/kornect/nxan-template/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/kornect/nxan-template/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/kornect/nxan-template" />
  </a>
</p>
</div>
<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Tech Stack](#space_invader-tech-stack)
  * [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Installation](#gear-installation)
  * [Running Tests](#test_tube-running-tests)
- [Roadmap](#compass-roadmap)
- [Contributing](#wave-contributing)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)



<!-- About the Project -->
## :star2: About the Project
This project is built to provide a template of a mono repo with a NestJS API and an Angular client. Please feel free to use it for your own projects. If you have any questions, feel free to open an issue or contact me.

<!-- TechStack -->
### :space_invader: Tech Stack

The project is in a mono repo implemented using [nx](https://nx.dev/):

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://angular.io/">Angular</a></li>
    <li><a href="https://ngneat.github.io/elf/">Elf State Management</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://docs.nestjs.com/">NestJS</a></li>
    <li><a href="https://mikro-orm.io/">Mikro-Orm</a></li>
    <li><a href="https://redis.io/">Redis</a></li>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
    <li><a href="https://www.passportjs.org/">Passport</a></li>
  </ul>
</details>

<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the root of the api project

rename `.env.example` to `.env` and populate the variables accordingly

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses npm as package manager, you will need to install it first. 
Docker is also required to run the database, redis and other services.

<!-- Installation -->
### :gear: Installation

Clone the project

```bash
  git clone https://github.com/kornect/nxan-template.git
```

Go to the project directory and install dependencies

```bash
  cd nxan-template
  npm install
```

Compose the docker containers for the database, redis and other services

```bash
  cd apps/api
  
  docker-compose up -d
```

Start the api server

```bash
  npm run start:api
```

Start the client server

```bash
  npm run start:client
```

<!-- Running Tests -->
### :test_tube: Running Tests

To run tests, run the following command

```bash
  nx test
```

<!-- Roadmap -->
## :compass: Roadmap

* [x] Auth Feature - Login, Register, Forgot Password, Reset Password, etc.
* [ ] User Management Feature


<!-- Contributing -->
## :wave: Contributing

<a href="https://github.com/kornect/nxan-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kornect/nxan-template" />
</a>

Contributions are always welcome!

See `contributing.md` for ways to get started.

<!-- License -->
## :warning: License

Copyright © 2023 [Kornect](https://github.com/kornect).<br />
This project is [MIT](https://github.com/kornect/nxan-template/blob/master/LICENSE) licensed.

<!-- Contact -->
## :handshake: Contact

* Github: [@kornect](https://github.com/kornect)
* LinkedIn: [@https:\/\/www.linkedin.com\/in\/mogaumokgabudi](https://linkedin.com/in/https:\/\/www.linkedin.com\/in\/mogaumokgabudi)

<!-- Acknowledgments -->
## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Shields.io](https://shields.io/)
- [Awesome Readme Template](https://github.com/Louis3797/awesome-readme-template)
- [readme-md-generator](https://github.com/kefranabg/readme-md-generator)
- [Nx](https://nx.dev/)
- [Angular](https://angular.io/)
- [NestJS](https://nestjs.com/)
- [Mikro-Orm](https://mikro-orm.io/)

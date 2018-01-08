![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Marketplace

LAND manager and wallet for [Decentraland](https://decentraland.org)

## Running the project

The core technologies of the marketplace are:
- [React](https://reactjs.org/) and [Redux](https://redux.js.org/) for the front end 
- [nodejs](https://nodejs.org/), [PostgreSQL](https://www.postgresql.org/)
- [Ethereum](https://www.ethereum.org/) nodes and a wallet to use on the browser ([Metamask](http://metamask.io/) for example).
- [Babel](https://babeljs.io/) to transpile the code and [ESLint](https://eslint.org/) alongside [prettier](https://prettier.io/) to lint the code

Once those dependencies are installed you can configure each part of the project.

The backend lives on the [`/src`](https://github.com/decentraland/marketplace/tree/master/src) folder and the front on the [`/webapp`](https://github.com/decentraland/marketplace/tree/master/webapp) folder.

First of all, you'll need to run [`npm install`](https://docs.npmjs.com/cli/install) on both directories. Once that's done, you can move to configuring each part:

### Back-end

- _Creating DB user_
- _Creating the database_
- _Adding the .env files_
- _Running the initialize script_
- _Running an ethereum node_
- _Running the server_

### Front-end

- _Adding the .env files (NODE_PATH)_
- _Running the front-end_

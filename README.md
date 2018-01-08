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

Keep in mind that both sides use [`dotenv`](https://github.com/motdotla/dotenv) via [decentraland-commons](https://github.com/decentraland/commons) to configure the environment. As such, you'll need to create your own `.env` files, following the `.env.example`s located on each folder.

First of all, you'll need to run [`npm install`](https://docs.npmjs.com/cli/install) on both directories. Once that's done, you can move to configuring each part:

### Back-end

- __Creating the DB user__<br /> Create a PostgreSQL named marketplace. You can do it running `$ createuser marketplace` on the terminal or by running the query `CREATE USER marketplace;`
- __Creating the database__<br /> You'll need to create a `marketplace` database.  You can do it running `$ createdb -O dev marketplace` on the terminal or by running the query `CREATE DATABASE marketplace OWNER marketplace;`. You can create a `marketplace_test` database if you want to run tests against it.
- __Adding the .env files__<br /> Create a `.env` file on the [`/src`](https://github.com/decentraland/marketplace/tree/master/src) folder and fill it following the `.env.example` file found there. You can skip most variables as they have a default value. There are some notable exceptions like `CONNECTION_STRING` which might look something like `CONNECTION_STRING="postgres://localhost:5432/marketplace"`
- __Running the initialize script__<br /> Go to the [`/scripts`](https://github.com/decentraland/marketplace/tree/master/scripts) folder and run the `initializeDatabase.js` script like this `babel-node initializeDatabase.js`. *Important!* Don't forget to add a `.env` file there!
- __Running an Ethereum node__<br /> If you want to be able to get that from the Ethereum blockchain, you'll need to have a node running on `http://localhost:8545`. You can use [Parity](https://www.parity.io/), [geth](https://github.com/ethereum/go-ethereum/wiki/geth), etc.
- __Running the server__<br /> To run the server, go to the [`/src`](https://github.com/decentraland/marketplace/tree/master/src) folder and run the `server.js` script like this `babel-node server.js`

If you don't want to install `babel-node` globally, you can use [npx](https://www.npmjs.com/package/npx) and install it locally.

### Front-end

- __Adding the .env files (NODE_PATH)__<br /> Create an `.env` file on the [`/src/webapp`](https://github.com/decentraland/marketplace/tree/master/src/webapp) folder and fill it following the `.env.example` file found there. You will need to specify `NODE_PATH` to be `src/` and `REACT_APP_API_URL` to be `http://localhost:5000` (unless you changed the default server configuration, if so point to the right `host:port`).
- __Running the front-end__<br /> You will need to first have the server running (see above). After that just jump into the webapp folder `$ cd webapp` and start the local development `$ npm start`

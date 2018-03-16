![](https://raw.githubusercontent.com/decentraland/web/gh-pages/img/decentraland.ico)

# Marketplace

[Decentraland](https://decentraland.org)'s LAND Manager, Wallet and Marketplace

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
- __Creating the database__<br /> You'll need to create a `marketplace` database.  You can do it running `$ createdb -O marketplace marketplace` on the terminal or by running the query `CREATE DATABASE marketplace OWNER marketplace;`. You can create a `marketplace_test` database if you want to run tests against it.
- __Adding the .env files__<br /> Create a `.env` file on the [`/src`](https://github.com/decentraland/marketplace/tree/master/src) folder and fill it following the `.env.example` file found there. You can skip most variables as they have a default value. There are some notable exceptions like `CONNECTION_STRING` which might look something like `CONNECTION_STRING="postgres://localhost:5432/marketplace"`
- __Migrate the database__<br /> Once you have your database you can go ahead and run the database migrations. To do it, simply run `npm run migrate up`. We use [node-pg-migrate](https://github.com/salsita/node-pg-migrate) behind the scenes and every argument after `migrate` will be forwarded to it. You environment will be picked up automatically from the `/src/.env` file, but you can override the `CONNECTION_STRING` by explicitly adding it like this `CONNECTION_STRING='' npm run migrate up`
- __Running the initialize script__<br /> Just run `npm run init-db`. Once it finishes seeding the database, the script will prompt you to add the latest data from the Blockchain to the database. You'll need to have a Ethereum node fot this to work (see below). If you want to run that later, you can use `npm run renew-blockchain-data`.
- __Running an Ethereum node__<br /> If you want to be able to get data from the Ethereum blockchain, you'll need to have a node running on `http://localhost:8545`. You can use [Parity](https://www.parity.io/), [geth](https://github.com/ethereum/go-ethereum/wiki/geth), etc.
- __Running the server__<br /> To run the server, go to the [`/src`](https://github.com/decentraland/marketplace/tree/master/src) folder and run the `server.js` script like this `babel-node server.js`
- __Run watchers__<br /> If you want to keep your database up-to-date with the blockchain, you need to run this watcher: `npm run monitor-blockchain`. Keep in mind that the address you use for each contract will determine the network. For more information in event watching, check [here](https://github.com/decentraland/marketplace/tree/master/scripts/monitor).

If you don't want to install `babel-node` globally, you can use [npx](https://www.npmjs.com/package/npx) and install it locally.

### Front-end

- __Adding the .env files__<br /> Create an `.env` file on the [`/webapp`](https://github.com/decentraland/marketplace/tree/master/webapp) folder and fill it following the `.env.example` file found there. You will need to specify `NODE_PATH` to be `src/`, `REACT_APP_API_URL` to be `http://localhost:5000` (unless you changed the default server configuration, if so point to the right `host:port`) and `REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS` to Ropsten's MANAToken address: `0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb`.
- __Running the front-end__<br /> You will need to first have the server running (see above). After that just jump into the webapp folder `$ cd webapp` and start the local development `$ npm start`

### Tests

To run the backend tests simply run `npm run test` or `npm run watch:test`. You'll need to create your own `.env` file for the `/specs` file mimicking the `.env.example` file that's in there. We do this so you can for example use a dedicated database `CONNECTION_STRING="postgres://localhost:5432/marketplace_test"`.
Remember that if you're using a test database, you'll need to migrate it. You can run `CONNECTION_STRING="postgres://localhost:5432/marketplace_test" npm run migrate up` to do so.

## Migrations

To keep your database up to date, you'll need to run `npm run migrate up` each time a new migration is introduced. Your database version lives on the `pgmigrations`. Check [node-pg-migrate](https://github.com/salsita/node-pg-migrate) for more info.

## Seed

If you need some test data to test the marketplace, you can use the seed for quick features. Run `npm run seed generate MODEL_NAME -- --amount NUMBER`, (which will look something like this `npm run seed generate Publication -- --amount 2`) and follow the prompts


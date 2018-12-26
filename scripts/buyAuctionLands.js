#!/usr/bin/env babel-node

import fs from 'fs'
import { eth, txUtils, Contract } from 'decentraland-eth'
import { Log, cli, utils } from 'decentraland-commons'

import { connectEth } from '../src/ethereum'
import { asyncBatch } from '../src/lib'
import { Bounds } from '../shared/map'
import { buildCoordinate, splitCoodinatePairs } from '../shared/coordinates'
import { loadEnv, asSafeAction } from './utils'

const log = new Log('buyAuctionLands')
const DEFAULT_OPTIONS = {
  retryFailedTxs: false,
  txDelay: 5000
}
const requiredOptionNames = ['parcels', 'manaTokenAddress']

const buyAuctionLands = {
  addCommands(program) {
    program
      .command('buy')
      .option('--parcels [parcels]', 'List of parcels to deploy. Required')
      .option(
        '--manaTokenAddress [manaTokenAddress]',
        'MANAToken contract address. Required'
      )
      .option('--account [account]', 'Account address')
      .option('--password [password]', 'Password for the account')
      .option(
        '-d, --txDelay [txDelay]',
        `Delay between txs in milliseconds. Default: ${DEFAULT_OPTIONS.txDelay}`
      )
      .option(
        '-r, --retryFailedTxs',
        'If this flag is present, the script will try to retry failed transactions'
      )
      .option(
        '-y, --yes',
        'If this flag is present the confirm prompt will be skipped'
      )
      .action(
        asSafeAction(async userOptions => {
          const options = Object.assign(DEFAULT_OPTIONS, userOptions)
          checkRequiredOptions(options, requiredOptionNames)

          log.info('Connecting to the blockchain')
          await connectEth()

          const account = options.account || eth.getAccount()
          const allParcels = options.parcels
            ? readJSON(expandPath(options.parcels))
            : []

          log.info('Checking for invalid parcels')
          const parcels = await getValidParcels(allParcels)

          if (parcels.length === 0) {
            log.info('No parcels to bid')
            return
          }

          if (options.password) {
            log.info(`Unlocking account ${account}`)
            eth.wallet.setAccount(account)
            await eth.wallet.unlockAccount(options.password)
          }

          if (!options.yes) {
            const landAuctionContract = eth.getContract('LANDAuction')
            const price = eth.utils.fromWei(
              await landAuctionContract.getCurrentPrice()
            )

            const shouldBuy = await cli.confirm(
              `About to bid on ${parcels.length} parcels at ${price} MANA. Run?`
            )
            if (!shouldBuy) process.exit()
          }

          await bidOnParcels(parcels, options.manaTokenAddress, {
            txDelay: options.txDelay,
            retryFailedTxs: options.retryFailedTxs
          })
        })
      )
  }
}

async function getValidParcels(allParcels) {
  const parcels = []
  const landRegistryContract = eth.getContract('LANDRegistry')

  for (const parcel of allParcels) {
    const { x, y } = parcel
    const parcelId = buildCoordinate(x, y)

    if (!Bounds.inBounds(x, y)) {
      log.info(`Parcel ${parcelId} is out of bounds`)
      continue
    }

    const owner = await landRegistryContract.ownerOfLand(x, y)
    if (!Contract.isEmptyAddress(owner)) {
      log.info(
        `Parcel ${parcelId} already has an owner on the blockchain: ${owner}`
      )
      continue
    }
    parcels.push(parcel)
  }

  return parcels
}

async function bidOnParcels(...args) {
  const [parcels, tokenAddress, { shouldRetry, txDelay }] = args

  const account = eth.getAccount()
  const landAuctionContract = eth.getContract('LANDAuction')
  const gasPrice = (await landAuctionContract.gasPriceLimit()).toNumber()
  const landsLimit = (await landAuctionContract.landsLimitPerBid()).toNumber()

  if (gasPrice === 0 || landsLimit === 0) {
    log.info(
      'Either gasPrice or landsLimit is 0, waiting and retrying in 10 seconds'
    )
    await utils.sleep(10000)
    return bidOnParcels(...args)
  } else {
    log.info(
      `Using ${gasPrice} as gasPrice and ${landsLimit} as land limit per bid`
    )
  }

  const txs = []
  const parcelsToRetry = []

  log.info(`Buying ${parcels.length} parcels with token ${tokenAddress}`)
  await asyncBatch({
    elements: parcels,
    callback: async parcelsBatch => {
      const { xs, ys } = splitCoodinatePairs(parcelsBatch)

      log.info(`Sending tx for ${xs.length} parcels`)
      const hash = await landAuctionContract.bid(
        xs,
        ys,
        account,
        tokenAddress,
        { gasPrice: gasPrice, from: account }
      )
      log.info(`Got tx hash ${hash} for bidding on ${xs.length} parcels`)
      txs.push({ hash, xs, ys })

      log.info(`Sleeping ${txDelay / 1000} seconds`)
      await utils.sleep(txDelay)
    },
    batchSize: landsLimit
  })

  for (const tx of txs) {
    const { hash, xs, ys } = tx
    log.info(`Waiting for tx: ${hash} which buys ${xs.length} parcels`)
    const transaction = await getConfirmedTransaction(hash)

    if (transaction === null) {
      for (const [index, x] of xs.entries()) {
        parcelsToRetry.push({ x, y: ys[index] })
      }
    }
  }

  log.info(`Bought ${parcels.length - parcelsToRetry.length} parcels`)

  if (parcelsToRetry.length > 0 && shouldRetry) {
    log.info(`Retrying on ${parcelsToRetry.length} parcels`)
    return bidOnParcels(parcelsToRetry, ...args.slice(1))
  }
}

async function getConfirmedTransaction(hash, retries = 0) {
  try {
    return await txUtils.getConfirmedTransaction(hash)
  } catch (error) {
    if (retries >= 3) {
      log.warn(`tx ${hash} failed after ${retries} retries: "${error}"`)
      return null
    } else {
      log.info(
        `Found an error with tx: ${hash}, retrying in 10 seconds to mitigate false fails`
      )
      await utils.sleep(10000)
      return getConfirmedTransaction(hash, retries + 1)
    }
  }
}

function checkRequiredOptions(opts, requiredOptionNames) {
  const hasRequiredArgs = requiredOptionNames.every(
    argName => opts[argName] != null
  )

  if (!hasRequiredArgs) {
    throw new Error(
      `Missing required arguments. Required: "${requiredOptionNames}"`
    )
  }
}

function expandPath(path) {
  if (!path) throw new Error(`Invalid path ${path}`)
  return ['.', '/'].includes(path[0]) ? path : `${__dirname}/${path}`
}

function readJSON(filepath) {
  let json
  try {
    log.debug(`Reading JSON file "${filepath}"`)
    const fileContent = fs.readFileSync(filepath).toString()
    json = JSON.parse(fileContent)
  } catch (error) {
    log.error(`Error trying to read file "${filepath}"`)
    throw error
  }
  return json
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([buyAuctionLands]))
    .catch(console.error)
}

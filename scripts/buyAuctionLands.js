#!/usr/bin/env babel-node

import { eth, Contract } from 'decentraland-eth'
import { Log, cli, utils } from 'decentraland-commons'

import { Bounds } from '../shared/map'
import { buildCoordinate, splitCoodinatePairs } from '../shared/coordinates'
import {
  setupEth,
  executeTransactions,
  loadEnv,
  asSafeAction,
  checkContains,
  readJSONElements
} from './utils'

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
          checkContains(options, requiredOptionNames)

          await setupEth(options.account, options.password)

          const parcels = await readJSONElements(
            options.parcels,
            getValidParcels
          )

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

  const txsToRetry = await executeTransactions(
    parcels,
    async parcelsBatch => {
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
      return [{ hash, data: parcelsBatch }]
    },
    { batchSize: landsLimit, txDelay }
  )

  log.info(`Bought ${parcels.length - txsToRetry.length} parcels`)

  if (txsToRetry.length > 0 && shouldRetry) {
    let parcelsToRetry = []
    for (const tx of txsToRetry) {
      parcelsToRetry = parcelsToRetry.concat(tx.data)
    }
    log.info(`Retrying on ${parcelsToRetry.length} parcels`)
    return bidOnParcels(parcelsToRetry, ...args.slice(1))
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([buyAuctionLands]))
    .catch(console.error)
}

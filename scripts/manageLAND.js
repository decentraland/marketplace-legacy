#!/usr/bin/env babel-node

import { eth } from 'decentraland-eth'
import { cli } from 'decentraland-server'
import { Log } from 'decentraland-commons'

import {
  setupEth,
  executeTransactions,
  loadEnv,
  asSafeAction,
  checkContains
} from './utils'
import { PROVIDER_TYPES } from '../src/ethereum'
import { asyncBatch } from '../src/lib'

const log = new Log('manageLAND')
const DEFAULT_OPTIONS = {
  retryFailedTxs: false,
  txDelay: 5000,
  batchSize: 10,
  gasPrice: undefined
}
const requiredOptionNames = ['from', 'to']

const manageMana = {
  addCommands(program) {
    program
      .command('transfer-all')
      .option('--from [from]', 'From address. Required')
      .option('--to [to]', 'To address. Required')
      .option('--account [account]', 'Account address')
      .option('--password [password]', 'Password for the account')
      .option(
        `--provider [${Object.values(PROVIDER_TYPES).join(' | ')}]`,
        `Prodiver type to be used. Default: ${PROVIDER_TYPES.HTTP}`
      )
      .option(
        '--batchSize [batchSize]',
        `Amount of simultaneous transfer transactions. Default ${
          DEFAULT_OPTIONS.batchSize
        }`
      )
      .option(
        '--gasPrice [gasPrice]',
        'Value to use as gas price. By default it will let the node calculate it'
      )
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

          await setupEth({
            account: options.account,
            password: options.password,
            providerType: options.provider
          })

          const balance = await getBalance(options.from)
          const { from, to } = options

          if (!options.yes) {
            const shouldTransfer = await cli.confirm(
              `About to move ${balance} LANDs from ${from} to ${to} by ${eth.getAccount()}. Ok?`
            )
            if (!shouldTransfer) process.exit()
          }

          const landBatches = await getLANDBatches(from, balance.toNumber())

          await transferLANDs({
            batchSize: options.batchSize,
            gasPrice: options.gasPrice,
            txDelay: options.txDelay,
            retryFailedTxs: options.retryFailedTxs,
            from,
            to,
            landBatches
          })
        })
      )
  }
}

async function transferLANDs(args) {
  const {
    from,
    to,
    landBatches,
    batchSize,
    gasPrice,
    shouldRetry,
    txDelay
  } = args

  const account = eth.getAccount()
  const LANDRegistryContract = eth.getContract('LANDRegistry')

  const isApprovedForAll = await LANDRegistryContract.isApprovedForAll(
    from,
    account
  )

  log.info(`Transfering LANDs to ${to}`)

  const txsToRetry = await executeTransactions(
    landBatches,
    recipientsBatch =>
      recipientsBatch.map(async landBatch => {
        const xs = []
        const ys = []
        let message = ''
        const landBatchPromises = landBatch.map(async land => {
          if (
            !isApprovedForAll &&
            from.toLowerCase() !== account.toLowerCase()
          ) {
            if (
              (await LANDRegistryContract.getApproved(
                land.id
              )).toLowerCase() !== account.toLowerCase()
            ) {
              throw new Error(
                `Error: ${account} does not have permission to move (${
                  land.x
                }, ${land.y})`
              )
            }
          }
          xs.push(land.x)
          ys.push(land.y)
          message += `Sending (${land.x}, ${land.y}) to ${to}\n`
        })

        await Promise.all(landBatchPromises)

        log.info(message)
        const hash = await LANDRegistryContract.transferManyLand(xs, ys, to, {
          gasPrice: gasPrice,
          from: account
        })

        return { hash, data: landBatch }
      }),
    { batchSize, txDelay }
  )

  log.info(`Sent ${landBatches.length - txsToRetry.length} transactions`)

  if (txsToRetry.length > 0 && shouldRetry) {
    const landBatchessToRetry = txsToRetry.map(tx => tx.data)
    log.info(`Retrying on ${landBatchessToRetry.length} recipients`)
    return transferLANDs(landBatchessToRetry, ...args.slice(1))
  }
}

async function getBalance(from) {
  return eth.getContract('LANDRegistry').balanceOf(from)
}

async function getLANDBatches(from, balance) {
  log.info(`Getting ${balance} LAND ids to transfer...`)

  const LANDRegistryContract = eth.getContract('LANDRegistry')
  let index = 0
  const landBatches = []

  await asyncBatch({
    elements: new Array(balance).fill(0),
    callback: async fakeIndexes => {
      const lands = []
      const promises = fakeIndexes.map(async () => {
        const id = await LANDRegistryContract.tokenOfOwnerByIndex(from, index++)
        const [x, y] = await LANDRegistryContract.decodeTokenId(id)
        lands.push({ x: x.toNumber(), y: y.toNumber(), id })
      })

      await Promise.all(promises)
      landBatches.push(lands)
    },
    batchSize: 70, //Maximum LAND to be transferred in bulk
    retryAttempts: 20
  })

  return landBatches
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([manageMana]))
    .catch(console.error)
}

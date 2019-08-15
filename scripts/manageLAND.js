#!/usr/bin/env babel-node

import { eth } from 'decentraland-eth'
import { cli } from 'decentraland-server'
import { Log, env } from 'decentraland-commons'

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

          await transferLANDs({
            batchSize: options.batchSize,
            gasPrice: options.gasPrice,
            txDelay: options.txDelay,
            retryFailedTxs: options.retryFailedTxs,
            balance: balance.toNumber(),
            from,
            to
          })
        })
      )
  }
}

async function transferLANDs(args) {
  const { from, to, balance, batchSize, gasPrice, shouldRetry, txDelay } = args

  const account = eth.getAccount()
  const LANDRegistryContract = eth.getContract('LANDRegistry')

  const lands = await getLANDs(from, balance)
  const isApprovedForAll = await LANDRegistryContract.isApprovedForAll(
    from,
    account
  )

  log.info(`Transfering LANDs to ${to}`)

  const txsToRetry = await executeTransactions(
    lands,
    recipientsBatch =>
      recipientsBatch.map(async land => {
        if (!isApprovedForAll && from.toLowerCase() !== account.toLowerCase()) {
          if (
            (await LANDRegistryContract.getApproved(land.id)).toLowerCase() !==
            account.toLowerCase()
          ) {
            throw new Error(
              `Error: ${account} does not have permission to move (${land.x}, ${
                land.y
              })`
            )
          }
        }

        log.info(`Sending (${land.x}, ${land.y}) to ${to}`)
        const hash = await LANDRegistryContract.transferFrom(
          from,
          to,
          land.id,
          {
            gasPrice: gasPrice,
            from: account
          }
        )

        return { hash, data: land }
      }),
    { batchSize, txDelay }
  )

  log.info(`Sent ${lands.length - txsToRetry.length} transactions`)

  if (txsToRetry.length > 0 && shouldRetry) {
    const landsToRetry = txsToRetry.map(tx => tx.data)
    log.info(`Retrying on ${landsToRetry.length} recipients`)
    return transferLANDs(landsToRetry, ...args.slice(1))
  }
}

async function getBalance(from) {
  return eth.getContract('LANDRegistry').balanceOf(from)
}

async function getLANDs(from, balance) {
  log.info(`Getting ${balance} LANDs to transfer...`)

  const LANDRegistryContract = eth.getContract('LANDRegistry')
  const lands = []
  let index = 0

  await asyncBatch({
    elements: new Array(balance).fill(0),
    callback: async fakeIndexes => {
      const promises = fakeIndexes.map(async () => {
        const id = await LANDRegistryContract.tokenOfOwnerByIndex(from, index++)
        const [x, y] = await LANDRegistryContract.decodeTokenId(id)
        lands.push({ x: x.toNumber(), y: y.toNumber(), id })
      })

      await Promise.all(promises)
    },
    batchSize: env.get('BATCH_SIZE', 50),
    retryAttempts: 20
  })

  return lands
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([manageMana]))
    .catch(console.error)
}

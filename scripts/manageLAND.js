#!/usr/bin/env babel-node

import { eth } from 'decentraland-eth'
import { cli } from 'decentraland-server'
import { Log } from 'decentraland-commons'

import {
  setupEth,
  executeTransactions,
  loadEnv,
  asSafeAction,
  checkContains,
  readJSONElements
} from './utils'
import { PROVIDER_TYPES } from '../src/ethereum'
import { asyncBatch } from '../src/lib'

const log = new Log('manageLAND')
const DEFAULT_OPTIONS = {
  retryFailedTxs: false,
  txDelay: 5000,
  batchSize: 10,
  landBatchSize: 35,
  gasPrice: undefined
}
const requiredManageLANDOptionNames = ['recipients']
const requiredTransferAllOptionNames = ['from', 'to']

const manageLAND = {
  addCommands(program) {
    program
      .command('manage-land')
      .option('--account [account]', 'Account address')
      .option('--password [password]', 'Password for the account')
      .option(
        `--provider [${Object.values(PROVIDER_TYPES).join(' | ')}]`,
        `Provider type to be used. Default: ${PROVIDER_TYPES.HTTP}`
      )
      .option(
        '--recipients [recipients]',
        'List of recipients with from, to and LAND id'
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
          await manageLANDAction(options)
        })
      )
  }
}

const transferAll = {
  addCommands(program) {
    program
      .command('transfer-all')
      .option('--from [from]', 'From address. Required')
      .option('--to [to]', 'To address. Required')
      .option('--account [account]', 'Account address')
      .option('--password [password]', 'Password for the account')
      .option(
        `--provider [${Object.values(PROVIDER_TYPES).join(' | ')}]`,
        `Provider type to be used. Default: ${PROVIDER_TYPES.HTTP}`
      )
      .option(
        '--landBatchSize [landBatchSize]',
        `Amount of simultaneous LAND to be transfer in one transaction. Default ${
          DEFAULT_OPTIONS.batchSize
        } (.5 of an ethereum block)`
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
          await transferAllAction(options)
        })
      )
  }
}

async function manageLANDAction(options) {
  checkContains(options, requiredManageLANDOptionNames)

  await setupEth({
    account: options.account,
    password: options.password,
    providerType: options.provider
  })

  const recipients = await readJSONElements(
    options.recipients,
    getValidRecipients
  )

  if (!options.yes) {
    const shouldTransfer = await cli.confirm(
      `About to transfer ${recipients.length} LANDs by ${eth.getAccount()}. Ok?`
    )
    if (!shouldTransfer) process.exit()
  }

  await transferLANDs({
    batchSize: options.batchSize,
    gasPrice: options.gasPrice,
    txDelay: options.txDelay,
    retryFailedTxs: options.retryFailedTxs,
    recipients
  })
}

async function transferAllAction(options) {
  checkContains(options, requiredTransferAllOptionNames)

  await setupEth({
    account: options.account,
    password: options.password,
    providerType: options.provider
  })

  const balance = await getBalance(options.from)
  const { from, to } = options

  if (!options.yes) {
    const shouldTransfer = await cli.confirm(
      `About to transfer ${balance} LANDs from ${from} to ${to} by ${eth.getAccount()}. Ok?`
    )
    if (!shouldTransfer) process.exit()
  }

  const landBatches = await getLANDBatches(
    from,
    balance.toNumber(),
    options.landBatchSize
  )

  await transferManyLAND({
    batchSize: options.batchSize,
    gasPrice: options.gasPrice,
    txDelay: options.txDelay,
    retryFailedTxs: options.retryFailedTxs,
    from,
    to,
    landBatches
  })
}

async function transferLANDs(args) {
  const { recipients, batchSize, gasPrice, shouldRetry, txDelay } = args

  const account = eth.getAccount()
  const LANDRegistryContract = eth.getContract('LANDRegistry')

  log.info('Transfering LANDs')

  const txsToRetry = await executeTransactions(
    recipients,
    recipientsBatch =>
      recipientsBatch.map(async recipient => {
        const { from, to, id } = recipient
        const [x, y] = id.split(',')
        const encodedId = await LANDRegistryContract.encodeTokenId(x, y)
        if (from.toLowerCase() !== account.toLowerCase()) {
          const isApprovedForAll = await LANDRegistryContract.isApprovedForAll(
            from,
            account
          )
          if (!isApprovedForAll) {
            await checkAllowance({ id: encodedId, x, y })
          }
        }

        console.log(`Sending (${x}, ${y}) from ${from} to ${to}\n`)

        const hash = await LANDRegistryContract.transferFrom(
          from,
          to,
          encodedId,
          {
            gasPrice: gasPrice,
            from: account
          }
        )

        return { hash, data: recipient }
      }),
    { batchSize, txDelay }
  )

  log.info(`Sent ${recipients.length - txsToRetry.length} transactions`)

  if (txsToRetry.length > 0 && shouldRetry) {
    const recipientsToRetry = txsToRetry.map(tx => tx.data)
    log.info(`Retrying on ${recipientsToRetry.length} recipients`)
    return transferLANDs(recipientsToRetry, ...args.slice(1))
  }
}

async function transferManyLAND(args) {
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
            await checkAllowance(isApprovedForAll, from, land.id)
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
    return transferManyLAND(landBatchessToRetry, ...args.slice(1))
  }
}

async function checkAllowance(land) {
  const account = eth.getAccount()
  const LANDRegistryContract = eth.getContract('LANDRegistry')
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

async function getBalance(from) {
  return eth.getContract('LANDRegistry').balanceOf(from)
}

async function getLANDBatches(from, balance, landBatchSize) {
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
    batchSize: landBatchSize, //Maximum LAND to be transferred in bulk
    retryAttempts: 20
  })

  return landBatches
}

async function getValidRecipients(allRecipients) {
  const recipients = []

  for (const recipient of allRecipients) {
    const { from, to, id } = recipient

    if (!from || !to || !id || id.split(',').length !== 2) {
      log.info(`Invalid recipient: ${from}, ${to}, ${id}`)
      continue
    }
    recipients.push(recipient)
  }

  return recipients
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([manageLAND, transferAll]))
    .catch(console.error)
}

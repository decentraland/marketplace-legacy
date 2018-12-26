#!/usr/bin/env babel-node

import fs from 'fs'
import { eth, txUtils } from 'decentraland-eth'
import { Log, cli, utils } from 'decentraland-commons'

import { connectEth } from '../src/ethereum'
import { asyncBatch } from '../src/lib'
import { loadEnv, asSafeAction } from './utils'

const log = new Log('manageMana')
const DEFAULT_OPTIONS = {
  retryFailedTxs: false,
  txDelay: 5000,
  batchSize: 10,
  gasPrice: undefined
}
const requiredOptionNames = ['recipients']

const manageMana = {
  addCommands(program) {
    program
      .command('transfer')
      .option(
        '--recipients [recipients]',
        'List of recipients with address and amount in MANA. Required'
      )
      .option('--account [account]', 'Account address')
      .option('--password [password]', 'Password for the account')
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
          checkRequiredOptions(options, requiredOptionNames)

          log.info('Connecting to the blockchain')
          await connectEth()

          const account = options.account || eth.getAccount()
          log.info(`Using ${account} as address`)

          const allRecipients = options.recipients
            ? readJSON(expandPath(options.recipients))
            : []

          log.info('Checking for invalid recipients')
          const recipients = await getValidRecipients(allRecipients)

          if (recipients.length === 0) {
            log.info('No valid recipients')
            return
          }

          if (options.password) {
            log.info(`Unlocking account ${account}`)
            eth.wallet.setAccount(account)
            await eth.wallet.unlockAccount(options.password)
          }

          const totalMana = recipients.reduce(
            (total, recipient) => total + parseFloat(recipient.amount, 10),
            0
          )
          await checkBalance(totalMana)

          if (!options.yes) {
            const recipientCount = recipients.length
            const shouldTransfer = await cli.confirm(
              `About to send ${totalMana} MANA to ${recipientCount} accounts. Ok?`
            )
            if (!shouldTransfer) process.exit()
          }

          await transferMana(recipients, {
            batchSize: options.batchSize,
            gasPrice: options.gasPrice,
            txDelay: options.txDelay,
            retryFailedTxs: options.retryFailedTxs
          })
        })
      )
  }
}

async function getValidRecipients(allRecipients) {
  const recipients = []

  for (const recipient of allRecipients) {
    const { address, amount } = recipient

    if (!address || !amount || amount <= 0) {
      log.info(
        'Invalid recipient, the `address` and `amount` keys are mandatory'
      )
      continue
    }

    recipients.push(recipient)
  }

  return recipients
}

async function transferMana(...args) {
  const [recipients, { batchSize, gasPrice, shouldRetry, txDelay }] = args

  const account = eth.getAccount()
  const manaTokenContract = eth.getContract('MANAToken')

  const txs = []
  const recipientsToRetry = []

  log.info(`Sending MANA to ${recipients.length} recipients`)
  await asyncBatch({
    elements: recipients,
    callback: async recipientsBatch => {
      for (const recipient of recipientsBatch) {
        const { address, amount } = recipient
        const mana = eth.utils.toWei(amount)

        await checkBalance(amount)

        log.info(`Sending tx for ${amount} MANA to ${address}`)
        const hash = await manaTokenContract.transfer(address, mana, {
          gasPrice: gasPrice,
          from: account
        })

        log.info(`Got tx hash ${hash} for transfering ${mana} MANA`)
        txs.push({ hash, recipient })

        log.info(`Sleeping ${txDelay / 1000} seconds`)
        await utils.sleep(txDelay)
      }
    },
    batchSize: batchSize
  })

  for (const tx of txs) {
    const { hash, recipient } = tx
    const { address, amount } = recipient
    log.info(
      `Waiting for tx: ${hash} which transfers ${amount} MANA to ${address}`
    )
    const transaction = await getConfirmedTransaction(hash)

    if (transaction === null) {
      recipientsToRetry.push(recipient)
    }
  }

  log.info(`Sent ${recipients.length - recipientsToRetry.length} transactions`)

  if (recipientsToRetry.length > 0 && shouldRetry) {
    log.info(`Retrying on ${recipientsToRetry.length} recipients`)
    return transferMana(recipientsToRetry, ...args.slice(1))
  }
}

async function checkBalance(mana) {
  const account = eth.getAccount()
  const balanceInWei = await eth.getContract('MANAToken').balanceOf(account)
  const balance = eth.utils.fromWei(balanceInWei)

  if (mana > balance) {
    throw new Error(
      `Wallet doesn't have enough MANA balance. Current: ${balance}, required: ${mana}`
    )
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
    .then(() => cli.runProgram([manageMana]))
    .catch(console.error)
}

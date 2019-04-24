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
          checkContains(options, requiredOptionNames)

          await setupEth(options.account, options.password)

          const recipients = await readJSONElements(
            options.recipients,
            getValidRecipients
          )

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

  log.info(`Sending MANA to ${recipients.length} recipients`)

  const txsToRetry = await executeTransactions(
    recipients,
    recipientsBatch =>
      recipientsBatch.map(async recipient => {
        const { address, amount } = recipient
        const mana = eth.utils.toWei(amount)

        await checkBalance(amount)

        log.info(`Sending tx for ${amount} MANA to ${address}`)
        const hash = await manaTokenContract.transfer(address, mana, {
          gasPrice: gasPrice,
          from: account
        })

        return { hash, data: recipient }
      }),
    { batchSize, txDelay }
  )

  log.info(`Sent ${recipients.length - txsToRetry.length} transactions`)

  if (txsToRetry.length > 0 && shouldRetry) {
    const recipientsToRetry = txsToRetry.map(tx => tx.data)
    log.info(`Retrying on ${recipientsToRetry.length} recipients`)
    return transferMana(recipientsToRetry, ...args.slice(1))
  }
}

async function checkBalance(mana) {
  const account = eth.getAccount()
  const balance = await eth.getContract('MANAToken').balanceOf(account)

  if (mana > balance) {
    throw new Error(
      `Wallet doesn't have enough MANA balance. Current: ${balance}, required: ${mana}`
    )
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => cli.runProgram([manageMana]))
    .catch(console.error)
}

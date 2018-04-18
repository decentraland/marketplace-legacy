#!/usr/bin/env babel-node

import { eth, txUtils } from 'decentraland-eth'
import { Log, cli } from 'decentraland-commons'
import faker from 'faker'

import { loadEnv } from './utils'
import { db } from '../src/database'
import { Publication } from '../src/Publication'

const log = new Log('seed')

loadEnv()

const seed = {
  addCommands(program) {
    program
      .command('generate <ModelName>')
      .option('--amount [amount]', 'Amount of rows to create. Defaults to 1')
      .action(async (ModelName, options) => {
        try {
          const ModelManifest = require(`../src/${ModelName}`)
          const Model = ModelManifest[ModelName]
          let amount = options.amount || 1

          log.info(
            `Fill the template for each ${ModelName} row to add (${amount})`
          )

          const questions = Model.columnNames.map(columnName => {
            return {
              type: 'input',
              name: columnName,
              message: `${columnName} (empty for random value)`,
              default: undefined
            }
          })
          const answers = await cli.prompt(questions)

          log.info(`Inserting ${amount} rows into ${Model.tableName}`)

          while (amount > 0) {
            const row = {}

            for (const columnName of Model.columnNames) {
              const value =
                answers[columnName] ||
                getRandomColumnValue(columnName, Model.tableName)

              if (value !== undefined) {
                row[columnName] = value
              }
            }

            log.info(
              `Inserting ${JSON.stringify(row)} row into ${Model.tableName}`
            )
            await Model.insert(row)

            amount -= 1
          }
        } catch (error) {
          log.error(`An error occured trying to generate rows for ${ModelName}`)
          log.error('Error', error)
        }

        process.exit()
      })
  }
}

function getRandomColumnValue(columnName, tableName) {
  let value = null

  switch (columnName) {
    case 'id':
      value = undefined
      break
    case 'address':
    case 'owner':
    case 'buyer':
      value = generateEthereumAddress()
      break
    case 'tx_hash':
    case 'hash':
      value = generateEthereumTxHash()
      break
    case 'tx_status': {
      value = faker.random.objectElement(txUtils.TRANSACTION_STATUS)
      break
    }
    case 'link':
      value = faker.internet.url()
      break
    case 'timestamp':
      value = faker.date.recent().getTime()
      break
    case 'district_id':
      value = faker.random.uuid()
      break
    case 'contract_id':
      value = faker.random.uuid().replace(/-/g, '')
      break
    case 'x':
    case 'y':
      value = Math.floor(Math.random() * 307) - 153
      break
    default: {
      if (columnName.includes('price')) {
        value = faker.random.number(10000000) // 10M max
      } else if (columnName.includes('_count')) {
        value = faker.random.number(1000) // 1k max
      } else if (columnName.includes('_at')) {
        value = faker.date.recent()
      } else if (columnName.includes('is_')) {
        value = faker.random.boolean()
      } else if (
        tableName === Publication.tableName &&
        columnName === 'status'
      ) {
        value = faker.random.objectElement(Publication.STATUS)
      } else {
        value = faker.random.words()
      }
    }
  }

  return value
}

function generateEthereumAddress() {
  let address = ''

  for (let i = 0; i < 40; i++) {
    address += faker.random.arrayElement([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F'
    ])
  }

  return ('0x' + address).toLowerCase()
}

function generateEthereumTxHash() {
  const seed = Math.random() * 1000000000
  const hash = eth.utils.sha3(seed)
  return hash.toString('hex').toLowerCase()
}

Promise.resolve()
  .then(() => db.connect())
  .then(() => cli.runProgram([seed]))
  .catch(console.error)

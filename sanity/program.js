#!/usr/bin/env babel-node

import { cli, Log } from 'decentraland-commons'

import { SanityActions } from './SanityActions'
import { db } from '../src/database'
import { connectEth } from '../src/ethereum'
import { loadEnv } from '../scripts/utils'

const log = new Log('main')

export async function main(getActions = createSanityActions) {
  log.info('Connecting to database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await connectEth(true)

  log.info('Starting CLI')
  const sanityActions = getActions()

  cli.runProgram([getProgram(sanityActions)])
}

function getProgram(actions) {
  return {
    addCommands(program) {
      program
        .command('run')
        .option(
          '--skip [names]',
          'Skip validations. Names separated by commas, no spaces'
        )
        .option('--check-parcel [parcelId]', 'Check a specific parcel')
        .option(
          '--start-from-block [blockNumber]',
          'In order to not get from 0 to latest, set the started block to get events. Decentraland starts at 4900000'
        )
        .option(
          '--self-heal',
          'Try to fix found errors. Supports all flags supported by the monitor, except watch'
        )
        .action(async options => {
          await actions.run(options)
        })
    }
  }
}

function createSanityActions(...args) {
  return new SanityActions(...args)
}

if (require.main === module) {
  loadEnv('../src/.env')
  log.info('Batch size configurable via BATCH_SIZE')

  Promise.resolve()
    .then(main)
    .catch(console.error)
}

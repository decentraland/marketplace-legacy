#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { cli, env, Log } from 'decentraland-commons'
import { SanityActions } from './SanityActions'
import { db } from '../src/database'
import { loadEnv } from '../scripts/utils'

const log = new Log('main')

export async function main(getActions = createSanityActions) {
  log.info('Connecting to database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS')),
      new contracts.LegacyMarketplace(env.get('LEGACY_MARKETPLACE_CONTRACT_ADDRESS')),
      new contracts.EstateRegistry(env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

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
          '--self-heal',
          'Try to fix found errors. Supports all flags supported by the monitor, except watch'
        )
        .action(options => actions.run(options))
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

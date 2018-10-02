#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { cli, env, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { MonitorActions } from './MonitorActions'
import { db } from '../src/database'
import { loadEnv } from '../scripts/utils'

const log = new Log('main')

export async function main(getActions = createMonitorActions) {
  log.info('Connecting to database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS')),
      new contracts.LegacyMarketplace(
        env.get('LEGACY_MARKETPLACE_CONTRACT_ADDRESS')
      ),
      new contracts.MortgageHelper(env.get('MORTGAGE_HELPER_CONTRACT_ADDRESS')),
      new contracts.RCNEngine(env.get('RCN_ENGINE_CONTRACT_ADDRESS')),
      new contracts.MortgageManager(
        env.get('MORTGAGE_MANAGER_CONTRACT_ADDRESS')
      ),
      new contracts.EstateRegistry(env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  log.info('Starting CLI')
  const monitorActions = getActions(
    handlers,
    {
      LegacyMarketplace: [
        'AuctionCreated',
        'AuctionSuccessful',
        'AuctionCancelled'
      ],
      LANDRegistry: [
        'Update',
        'Transfer',
        'EstateRegistrySet',
        'UpdateOperator'
      ],
      MortgageHelper: ['NewMortgage'],
      MortgageManager: [
        'CanceledMortgage',
        'StartedMortgage',
        'PaidMortgage',
        'DefaultedMortgage'
      ],
      RCNEngine: ['PartialPayment', 'TotalPayment'],
      EstateRegistry: [
        'AddLand',
        'RemoveLand',
        'Update',
        'UpdateOperator',
        'CreateEstate',
        'Transfer'
      ]
    },
    env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000) // 2 minutes
  )

  cli.runProgram([getProgram(monitorActions)])
}

function getProgram(actions) {
  return {
    addCommands(program) {
      program
        .command('index')
        .option(
          '--args [args]',
          'JSON string containing args to filter by. Defaults to {}'
        )
        .option(
          '--from-block [fromBlock]',
          'The number of the earliest block. Defaults to 0'
        )
        .option(
          '--to-block [toBlock]',
          'The number of the latest block. Defaults to `latest`'
        )
        .option(
          '--address [address]',
          'An address to only get logs from particular account(s).'
        )
        .option(
          '-w, --watch',
          'Keep watching the blockchain for new events after --to-block.'
        )
        .option(
          '--skip-process',
          'Only restore the stored events, without processing each one'
        )
        .allowUnknownOption()
        .action(options => actions.index(options))
    }
  }
}

function createMonitorActions(...args) {
  return new MonitorActions(...args)
}

if (require.main === module) {
  loadEnv('../src/.env')

  Promise.resolve()
    .then(main)
    .catch(console.error)
}

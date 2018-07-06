#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { MonitorCli } from './MonitorCli'
import { db } from '../src/database'
import { loadEnv } from '../scripts/utils'

const log = new Log('main')

export async function main(
  getNewMonitor = (...args) => new MonitorCli(...args)
) {
  log.debug('Connecting to database')
  await db.connect()

  log.debug('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS')),
      new contracts.Marketplace(env.get('MARKETPLACE_CONTRACT_ADDRESS')),
      new contracts.MortgageCreator(
        env.get('MORTGAGE_CREATOR_CONTRACT_ADDRESS')
      ),
      new contracts.RCNEngine(env.get('RCN_ENGINE_CONTRACT_ADDRESS')),
      new contracts.MortgageManager(
        env.get('MORTGAGE_MANAGER_CONTRACT_ADDRESS')
      )
    ],
    provider: env.get('RPC_URL')
  })

  log.debug('Starting CLI')
  const monitor = getNewMonitor(
    handlers,
    {
      Marketplace: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled'],
      LANDRegistry: ['Update', 'Transfer'],
      MortgageCreator: ['NewMortgage'],
      MortgageManager: [
        'CanceledMortgage',
        'StartedMortgage',
        'PaidMortgage',
        'DefaultedMortgage'
      ],
      RCNEngine: ['PartialPayment', 'TotalPayment']
    },
    env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000) // 2 minutes
  )
  await monitor.run()
}

if (require.main === module) {
  loadEnv('../src/.env')

  main().catch(error => {
    log.error(error)
    process.exit()
  })
}

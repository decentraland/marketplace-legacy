#!/usr/bin/env ts-node

// TODO: Remove this
require('babel-polyfill')
import { Log, env } from 'decentraland-commons'
import { contracts, eth } from 'decentraland-eth'
import { loadEnv } from '../../scripts/utils'
import { db } from '../../src/database'
import { MonitorCli } from './MonitorCli'
import * as handlers from './handlers'

const log = new Log('main')

loadEnv('../../src/.env')

async function main() {
  log.debug('Connecting to database')
  await db.connect()

  log.debug('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS')),
      new contracts.Marketplace(env.get('MARKETPLACE_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })
  log.debug('Starting CLI')

  return new MonitorCli(
    handlers,
    {
      Marketplace: ['AuctionCreated', 'AuctionSuccessful', 'AuctionCancelled'],
      LANDRegistry: ['Update', 'Transfer']
    },
    env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000) // 2 minutes
  ).run()
}

main().catch(error => {
  log.error(error)
  process.exit()
})

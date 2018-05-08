#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { MonitorCli } from './MonitorCli'
import { connectDatabase } from '../../src/database'

const log = new Log('monitor')

export async function runMonitor() {
  log.debug('Connecting to database')
  await connectDatabase()

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

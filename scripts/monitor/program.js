#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { MonitorCli } from './MonitorCli'
import { db } from '../../src/database'
import { loadEnv } from '../../scripts/utils'

const log = new Log('main')

loadEnv('../../src/.env')

Promise.resolve()
  .then(() => {
    log.debug('Connecting to database')
    return db.connect()
  })
  .then(() => {
    log.debug('Connecting to Ethereum node')
    return eth.connect({
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
  })
  .then(() => {
    log.debug('Starting CLI')

    return new MonitorCli(
      handlers,
      {
        Marketplace: [
          'AuctionCreated',
          'AuctionSuccessful',
          'AuctionCancelled'
        ],
        LANDRegistry: ['Update', 'Transfer'],
        MortgageCreator: ['NewMortgage'],
        MortgageManager: ['CanceledMortgage']
      },
      env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000) // 2 minutes
    ).run()
  })
  .catch(error => {
    log.error(error)
    process.exit()
  })

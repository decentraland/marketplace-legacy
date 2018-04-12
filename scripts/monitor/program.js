#!/usr/bin/env babel-node

import { env, eth, Log } from 'decentraland-commons'
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
      providerUrl: env.get('RPC_URL')
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
        LANDRegistry: ['Update', 'Transfer']
      },
      env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000) // 2 minutes
    ).run()
  })
  .catch(error => {
    log.error(error)
    process.exit()
  })

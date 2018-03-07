#!/usr/bin/env babel-node

import { eth, Log, contracts } from 'decentraland-commons'
import * as handlers from './handlers'
import { TransformCli } from './TransformCli'
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
    // Although the CLI adds the required contracts automatically, we'll need LANDRegistry to decode assetIds
    // So it's better to have it available at all times
    return eth.connect({
      contracts: [contracts.LANDRegistry]
    })
  })
  .then(() => {
    log.debug('Starting CLI')
    return new TransformCli(handlers).run()
  })
  .catch(error => {
    log.error(error)
    process.exit()
  })

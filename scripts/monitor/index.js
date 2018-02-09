#!/usr/bin/env babel-node

import { env, eth, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { Cli } from './Cli'
import { db } from '../../src/database'

env.load()

const log = new Log('main')

Promise.resolve()
  .then(() => {
    log.debug('Connecting to database')
    return db.connect()
  })
  .then(() => {
    log.debug('Connecting to Ethereum node')
    return eth.connect()
  })
  .then(() => {
    log.debug('Starting CLI')
    return new Cli(handlers).run()
  })
  .catch(error => {
    log.error(error)
    process.exit()
  })

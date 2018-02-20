#!/usr/bin/env babel-node

import { execSync } from 'child_process'
import { Log, env, cli } from 'decentraland-commons'

import { db } from '../src/database'
import { indexBlockchain } from './indexBlockchain'

const log = new Log('init')

env.load()

export async function initializeDatabase() {
  const shouldContinue = await cli.confirm(
    'Careful! this will DROP and reset the current `parcels` and `districts` database.\nDo you wish to continue?'
  )
  if (!shouldContinue) return process.exit()

  log.info('Dropping current state')
  execSync('psql $CONNECTION_STRING -f ./drop.sql')

  log.info('Dumping parcel_states')
  execSync('psql $CONNECTION_STRING -f ../dumps/parcel_states.20180105.sql')

  log.info('Dumping projects')
  execSync('psql $CONNECTION_STRING -f ../dumps/projects.20180105.sql')

  log.info('Dumping district_entries')
  execSync('psql $CONNECTION_STRING -f ../dumps/districts.20180105.sql')

  log.info('Normalizing names for new model')
  execSync('psql $CONNECTION_STRING -f ./init.sql')

  const shouldUpdate = await cli.confirm(
    'Do you want to update the database to the last data found on the blockchain?'
  )

  if (shouldUpdate) {
    await indexBlockchain()
  }

  log.info('All done!')
  process.exit()
}

Promise.resolve()
  .then(db.connect)
  .then(initializeDatabase)
  .catch(console.error)

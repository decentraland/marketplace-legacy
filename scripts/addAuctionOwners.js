#!/usr/bin/env babel-node

import { execSync } from 'child_process'
import { env, Log } from 'decentraland-commons'

import { db } from '../src/database'
import { Parcel } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { loadEnv, runpsql } from './utils'

let BATCH_SIZE
const log = new Log('addAuctionOwners')

export async function addAuctionOwners() {
  log.info('Connecting database')
  await db.connect()

  log.info('Restoring parcel_states')
  execSync(runpsql('../dumps/parcel_states.20180105.sql'))

  log.info('Adding auction_owner values to parcels table')
  await normalizeParcelStates()

  log.info('Dropping parcel_states')
  execSync(runpsql('./drop.sql'))

  log.info('All done!')
  process.exit()
}

async function normalizeParcelStates() {
  let parcelStates = await db.query('SELECT * FROM parcel_states')
  parcelStates = parcelStates.filter(parcel => parcel.address)

  await asyncBatch({
    elements: parcelStates,
    callback: async parcelStatesBatch => {
      const updates = parcelStatesBatch.map(parcelState =>
        Parcel.update(
          { auction_owner: parcelState.address },
          { id: parcelState.id }
        )
      )
      await Promise.all(updates)
    },
    batchSize: BATCH_SIZE
  })
}

if (require.main === module) {
  loadEnv()
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 200), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(addAuctionOwners)
    .catch(console.error)
}

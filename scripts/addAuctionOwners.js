#!/usr/bin/env babel-node

import { execSync } from 'child_process'
import { env, Log } from 'decentraland-commons'

import { queryDatabase, connectDatabase } from '../src/database'
import { Parcel } from '../src/Parcel'
import { asyncBatch } from '../src/lib'
import { runpsql } from './utils'

const BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 200), 10)
const log = new Log('addAuctionOwners')

export async function addAuctionOwners() {
  log.info('Connecting database')
  await connectDatabase()

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
  let parcelStates = await queryDatabase('SELECT * FROM parcel_states')
  parcelStates = parcelStates.filter(parcel => parcel.address)

  let count = 0

  await asyncBatch({
    elements: parcelStates,
    callback: async parcelStatesBatch => {
      count += parcelStatesBatch.length

      log.info(`Updating ${count}/${parcelStates.length} parcels...`)

      const updates = parcelStatesBatch.map(parcelState =>
        Parcel.update(
          { auction_owner: parcelState.address },
          { where: { id: parcelState.id } }
        )
      )
      await Promise.all(updates)
    },
    batchSize: BATCH_SIZE
  })
}

if (require.main === module) {
  addAuctionOwners()
    .catch(error => log.error(error))
    .then(() => process.exit())
}

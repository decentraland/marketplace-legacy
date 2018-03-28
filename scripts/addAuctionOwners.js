#!/usr/bin/env babel-node

import { execSync } from 'child_process'
import { Log } from 'decentraland-commons'

import { db } from '../src/database'
import { Parcel } from '../src/Parcel'
import { loadEnv, runpsql } from './utils'

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
  const parcelStates = await db.query('SELECT * FROM parcel_states')

  for (const parcelState of parcelStates) {
    if (parcelState.address) {
      log.info(`Updating ${parcelState.id} with ${parcelState.address}`)
      await Parcel.update(
        { id: parcelState.id },
        { auction_owner: parcelState.address }
      )
    }
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(addAuctionOwners)
    .catch(console.error)
}

#!/usr/bin/env babel-node

import { Log, env } from 'decentraland-commons'

import { db } from '../src/database'
import { connectEth } from '../src/ethereum'
import { Parcel, ParcelService } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('update')

export async function renewBlockchainData() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await connectEth()

  log.info('Storing `parcels` data')
  const parcels = await Parcel.find()
  await updateParcelsData(parcels)

  log.info('All done')
}

export async function updateParcelsData(parcels) {
  const service = new ParcelService()
  let updates = []

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)
      newParcels = await service.addTokenIds(newParcels)

      updates = updates.concat(
        newParcels.map(({ id, ...parcel }) => Parcel.update(parcel, { id }))
      )
    },
    batchSize: BATCH_SIZE,
    retryAttempts: 20
  })

  log.info(`Waiting for the DB to finish for ${updates.length} updates`)
  await Promise.all(updates)
}

if (require.main === module) {
  loadEnv()
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 50), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(renewBlockchainData)
    .then(() => process.exit())
    .catch(error => console.error('An error occurred.\n', error))
}

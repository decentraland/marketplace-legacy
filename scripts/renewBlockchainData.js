#!/usr/bin/env babel-node
import { eth, contracts } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'
import ProgressBar from 'progress'

import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('update')

export async function renewBlockchainData() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  log.info('Storing `parcels` data')
  const parcels = await Parcel.find()
  await updateParcelsData(parcels)

  log.info('All done')
}

export async function updateParcelsData(parcels) {
  const bar = new ProgressBar(
    'Processing [:bar] :percent :current/:total parcels',
    { total: parcels.length }
  )
  const service = new ParcelService()

  let updates = []
  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)
      newParcels = await service.addAssetIds(newParcels)

      bar.tick(BATCH_SIZE)

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

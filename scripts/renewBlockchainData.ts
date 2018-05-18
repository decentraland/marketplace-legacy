#!/usr/bin/env node-node

// TODO: Remove this
require('babel-polyfill')
import { Log, env } from 'decentraland-commons'
import { contracts, eth } from 'decentraland-eth'
import { Parcel, ParcelAttributes, ParcelService } from '../src/Asset'
import { db } from '../src/database'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE: number
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
  log.info(`Processing ${parcels.length} parcels`)

  const service = new ParcelService()

  let updates = []

  await asyncBatch<ParcelAttributes>({
    elements: parcels,
    callback: async (newParcels, batchSize) => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)
      newParcels = await service.addAssetIds(newParcels)

      log.info(`Processing ${batchSize}/${parcels.length} parcels`)

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
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', '1000'), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(renewBlockchainData)
    .then(() => process.exit())
    .catch(error => console.error('An error occurred.\n', error))
}

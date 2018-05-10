#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'
import { connectDatabase } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib'

const BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 1000), 10)
const log = new Log('update')

export async function renewBlockchainData() {
  log.info('Connecting database')
  await connectDatabase()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  log.info('Storing `parcels` data')
  const parcels = await Parcel.findAll()
  await updateParcelsData(parcels)

  log.info('All done')
  process.exit()
}

export async function updateParcelsData(parcels) {
  log.info(`Processing ${parcels.length} parcels`)

  const service = new ParcelService()

  let updates = []

  await asyncBatch({
    elements: parcels,
    callback: async (newParcels, batchSize) => {
      newParcels = await service.addLandData(newParcels)
      newParcels = await service.addOwners(newParcels)
      newParcels = await service.addAssetIds(newParcels)

      log.info(`Processing ${batchSize}/${parcels.length} parcels`)

      updates = updates.concat(
        newParcels.map(({ id, ...parcel }) =>
          Parcel.update(parcel, { where: { id } })
        )
      )
    },
    batchSize: BATCH_SIZE,
    retryAttempts: 20
  })

  log.info(`Waiting for the DB to finish for ${updates.length} updates`)
  await Promise.all(updates)
}

if (require.main === module) {
  renewBlockchainData()
    .catch(error => log.error(error))
    .then(() => process.exit())
}

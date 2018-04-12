#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'

import { db } from '../src/database'
import { Parcel } from '../src/Parcel'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('addAssetIds')

export async function addAssetIds() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  const parcels = await Parcel.find()
  await updateAssetIds(parcels)

  log.info('All done!')
  process.exit()
}

export async function updateAssetIds(parcels) {
  parcels = parcels.filter(parcel => !parcel.asset_id) // avoid adding a new method to Parcel

  const contract = eth.getContract('LANDRegistry')

  await asyncBatch({
    elements: parcels,
    callback: async (parcelsBatch, batchedCount) => {
      log.info(`Updating ${batchedCount}/${parcels.length} parcels...`)

      const updates = parcelsBatch.map(async parcel => {
        const assetId = await contract.encodeTokenId(parcel.x, parcel.y)
        return Parcel.update(
          { asset_id: assetId.toString() },
          { id: parcel.id }
        )
      })

      await Promise.all(updates)
    },
    batchSize: BATCH_SIZE
  })
}

if (require.main === module) {
  loadEnv()
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 300), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(addAssetIds)
    .catch(console.error)
}

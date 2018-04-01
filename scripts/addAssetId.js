#!/usr/bin/env babel-node

import { env, Log, eth, contracts } from 'decentraland-commons'

import { db } from '../src/database'
import { Parcel } from '../src/Parcel'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('addAssetId')

export async function addAuctionOwners() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [contracts.LANDRegistry],
    providerUrl: env.get('RPC_URL')
  })

  let parcels = await Parcel.find()
  parcels = parcels.filter(parcel => !parcel.asset_id) // avoid adding a new method to Parcel

  await updateAssetIds(parcels)

  log.info('All done!')
  process.exit()
}

async function updateAssetIds(parcels) {
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
    .then(addAuctionOwners)
    .catch(console.error)
}

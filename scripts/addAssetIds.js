#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'

import { connectDatabase } from '../src/database'
import { Parcel } from '../src/Parcel'
import { asyncBatch } from '../src/lib'

const BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 300), 10)
const log = new Log('addAssetIds')

export async function addAssetIds() {
  log.info('Connecting database')
  await connectDatabase()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  const parcels = await Parcel.findAll({
    where: { asset_id: null }
  })
  await updateAssetIds(parcels)

  log.info('All done!')
  process.exit()
}

export async function updateAssetIds(parcels) {
  const contract = eth.getContract('LANDRegistry')

  await asyncBatch({
    elements: parcels,
    callback: async (parcelsBatch, batchedCount) => {
      log.info(`Updating ${batchedCount}/${parcels.length} parcels...`)

      const updates = parcelsBatch.map(async parcel => {
        const assetId = await contract.encodeTokenId(parcel.x, parcel.y)
        return parcel.update({ asset_id: assetId.toString() })
      })

      await Promise.all(updates)
    },
    batchSize: BATCH_SIZE
  })
}

if (require.main === module) {
  addAssetIds()
    .catch(error => log.error(error))
    .then(() => process.exit())
}

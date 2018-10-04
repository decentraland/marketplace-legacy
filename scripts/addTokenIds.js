#!/usr/bin/env babel-node

import { eth } from 'decentraland-eth'
import { env, Log } from 'decentraland-commons'

import { db } from '../src/database'
import { connectEth } from '../src/ethereum'
import { Parcel } from '../src/Asset'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('addTokenIds')

export async function addTokenIds() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await connectEth()

  const parcels = await Parcel.find()
  await updateTokenIds(parcels)

  log.info('All done!')
  process.exit()
}

export async function updateTokenIds(parcels) {
  parcels = parcels.filter(parcel => !parcel.token_id) // Filter to avoid adding a new method to Parcel

  const contract = eth.getContract('LANDRegistry')

  await asyncBatch({
    elements: parcels,
    callback: async parcelsBatch => {
      const updates = parcelsBatch.map(async parcel => {
        const tokenId = await contract.encodeTokenId(parcel.x, parcel.y)
        return Parcel.update(
          { token_id: tokenId.toString() },
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
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 200), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(addTokenIds)
    .catch(console.error)
}

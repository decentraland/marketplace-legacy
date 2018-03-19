#!/usr/bin/env babel-node

import { Log, env, eth, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib/asyncBatch'
import { loadEnv } from './utils'

const log = new Log('update')

const BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 1000), 10)

export async function sanityCheck() {
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [contracts.LANDRegistry],
    providerUrl: env.get('RPC_URL')
  })

  log.info('Processing parcels from -150,-150 to 150,150')
  await processParcels()
}

async function processParcels() {
  const parcels = await Parcel.find()

  log.info(`Processing ${parcels.length} parcels`)

  const service = new ParcelService()

  const errors = []
  let processedCount = 0

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {

      for (let parcel of newParcels) {
        if (parcel.owner) {
          if (!(await service.isOwner(parcel.owner, parcel))) {
            errors.push(parcel)
            log.error(`Mismatch: owner of ${parcel.x}, ${parcel.y} is ${parcel.owner} on the DB`)
          }
        }
      }

      log.info(`Processing ${processedCount}/${parcels.length} parcels`)

      processedCount += newParcels.length
    },
    batchSize: BATCH_SIZE
  })

  log.info(`Parcel ownership scan done, ${errors.length} errors found: \n${
    errors.map(e => `  ${e.x},${e.y}\n`).join('\n  ')
  }`)
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(sanityCheck)
    .then(() => process.exit())
    .catch(error => console.error('An error occurred.\n', error))
}

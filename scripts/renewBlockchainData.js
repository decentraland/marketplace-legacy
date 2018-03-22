#!/usr/bin/env babel-node

import { Log, env, eth, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { asyncBatch } from '../src/lib/asyncBatch'
import { loadEnv } from './utils'

const log = new Log('update')

const BATCH_SIZE = parseInt(env.get('RENEW_BATCH_SIZE', 1000), 10)

export async function renewBlockchainData() {
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [contracts.LANDRegistry],
    providerUrl: env.get('RPC_URL')
  })

  log.info('Storing `parcels` data')
  await processParcels()
}

async function processParcels() {
  const parcels = await Parcel.find()
  await updateParcelsData(parcels)

  log.info('All done')
}

async function updateParcelsData(parcels) {
  log.info(`Processing ${parcels.length} parcels`)

  const service = new ParcelService()

  let errors = []
  let updates = []
  let total = BATCH_SIZE

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      try {
        newParcels = await service.addLandData(newParcels)
        newParcels = await service.addOwners(newParcels)
      } catch (error) {
        log.info(`Error processing ${newParcels.length} parcels, will retry`)
        errors = errors.concat(newParcels)
        return
      }

      log.info(`Processing ${total}/${parcels.length - errors.length} parcels`)

      updates = updates.concat(
        newParcels.map(({ id, ...parcel }) => Parcel.update(parcel, { id }))
      )

      total += newParcels.length
    },
    batchSize: BATCH_SIZE
  })
  log.info(`Waiting for the DB to finish for ${updates.length} updates`)

  await Promise.all(updates)

  if (errors.length) {
    return await updateParcelsData(errors)
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(renewBlockchainData)
    .then(() => process.exit())
    .catch(error => console.error('An error occurred.\n', error))
}

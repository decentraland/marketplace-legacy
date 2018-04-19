#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-commons'
import { env, Log } from 'decentraland-commons'

import { db } from '../src/database'
import { Publication } from '../src/Publication'
import { asyncBatch } from '../src/lib'
import { getBlockTime } from './monitor/processEvents'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('addBlockTimes')

export async function addBlockTimes() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [contracts.LANDRegistry],
    providerUrl: env.get('RPC_URL')
  })

  const publications = await Publication.find()
  await updateBlockTimes(publications)

  log.info('All done!')
  process.exit()
}

async function updateBlockTimes(publications) {
  publications = publications.filter(parcel => !parcel.block_time_created_at) // avoid adding a new method to Publication

  await asyncBatch({
    elements: publications,
    callback: async (publicationsBatch, batchedCount) => {
      log.info(
        `Updating ${batchedCount}/${publications.length} publications...`
      )

      const updates = publicationsBatch.map(async publication => {
        const block_time_created_at = await getBlockTime(
          publication.block_number
        )
        return Publication.update(
          { block_time_created_at },
          { tx_hash: publication.tx_hash }
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
    .then(addBlockTimes)
    .catch(console.error)
}

#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { Log, env, utils } from 'decentraland-commons'

import { db } from '../src/database'
import { Publication } from '../src/Publication'
import { BlockTimestampService } from '../src/BlockTimestamp'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE
const log = new Log('addBlockTimes')

export async function addBlockTimes() {
  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  await updateAllPublications()

  log.info('All done!')
  process.exit()
}

async function updateAllPublications() {
  try {
    const publications = await Publication.find()
    await updateBlockTimes(publications)
  } catch (error) {
    log.error('Error, retrying', error.message)
    await utils.sleep(50)
    return updateAllPublications()
  }
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
        const block_time_created_at = await new BlockTimestampService().getBlockTime(
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

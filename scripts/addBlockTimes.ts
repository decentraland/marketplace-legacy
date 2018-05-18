#!/usr/bin/env ts-node

// TODO: Remove this
require('babel-polyfill')
import { Log, env, utils } from 'decentraland-commons'
import { contracts, eth } from 'decentraland-eth'
import { BlockTimestampService } from '../src/BlockTimestamp'
import { Publication, PublicationAttributes } from '../src/Publication'
import { db } from '../src/database'
import { asyncBatch } from '../src/lib'
import { loadEnv } from './utils'

let BATCH_SIZE: number
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

  await asyncBatch<PublicationAttributes>({
    elements: publications,
    callback: async (publicationsBatch, batchedCount) => {
      log.info(
        `Updating ${batchedCount}/${publications.length} publications...`
      )

      const updates = publicationsBatch.map(async publication => {
        const blockTimeCreatedAt = await new BlockTimestampService().getBlockTime(
          publication.block_number
        )
        return Publication.update(
          { block_time_created_at: blockTimeCreatedAt },
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
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', '300'), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(addBlockTimes)
    .catch(console.error)
}

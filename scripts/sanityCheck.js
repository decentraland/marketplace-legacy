#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { Log, env, cli } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { Publication } from '../src/Publication'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { asyncBatch } from '../src/lib'
import { processEvent } from './monitor/processEvents'
import { MonitorCli } from './monitor/MonitorCli'
import { main as indexMissingEvents } from './monitor/program'
import { parseCLICoords, loadEnv } from './utils'

const log = new Log('sanity-check')

let BATCH_SIZE

const sanityCheck = {
  addCommands(program) {
    program
      .command('run')
      .option('--skip-parcels', 'Skip the parcel check')
      .option('--check-parcel [parcelId]', 'Check a specific parcel')
      .option('--self-heal', 'Try to fix found errors')
      .action(async options => {
        log.info('Connecting database')
        await db.connect()

        log.info('Connecting to Ethereum node')
        await eth.connect({
          contracts: [
            new contracts.LANDRegistry(
              env.get('LAND_REGISTRY_CONTRACT_ADDRESS')
            ),
            new contracts.Marketplace(env.get('MARKETPLACE_CONTRACT_ADDRESS'))
          ],
          provider: env.get('RPC_URL')
        })

        const shouldSkipParcels = options.skipParcels
        const totalChecks = shouldSkipParcels ? 1 : 2
        let conditions = null

        if (options.checkParcel) {
          const [x, y] = parseCLICoords(options.checkParcel)
          conditions = { x, y }
        }
        const parcels = await Parcel.find(conditions)

        log.info(`[Check 1/${totalChecks}]: Checking Marketplace publications`)
        let inconsistencies = await getInconsistentPublishedParcels(parcels)

        if (!shouldSkipParcels) {
          log.info(
            `[Check 2/${totalChecks}]: Checking parcel ownership from -150,-150 to 150,150`
          )

          const inconsistentParcels = await getInconsistentParcels(parcels)
          inconsistencies.concat(inconsistentParcels)
        }

        if (options.selfHeal) {
          if (inconsistencies.length) {
            log.info(`Attempting to heal ${inconsistencies.length} parcels`)
            log.info('Retreiving missing events')

            await indexMissingEvents(
              (...args) => new SanityMonitorCli(inconsistencies, ...args)
            )
          }
        }

        process.exit()
      })
  }
}

async function getInconsistentPublishedParcels(parcels) {
  const faultyParcels = []

  await asyncBatch({
    elements: parcels,
    callback: async (parcelsBatch, batchedCount) => {
      for (const parcel of parcelsBatch) {
        const sanityErrors = await getPublicationInconsistencies(parcel)
        if (sanityErrors) {
          log.info(sanityErrors)
          faultyParcels.push(parcel)
        }
      }
      process.stdout.write(`- ${batchedCount}/${parcels.length}   \r`)
    },
    batchSize: BATCH_SIZE,
    retryAttempts: 20
  })

  console.log('Errors', faultyParcels)
  return faultyParcels
}

async function getPublicationInconsistencies(parcel) {
  if (!parcel) return ''

  const { id, asset_id } = parcel
  const marketplace = eth.getContract('Marketplace')
  const publication = (await Publication.findByAssetId(id))[0]
  const auction = await marketplace.auctionByAssetId(asset_id)
  const contractId = auction[0]

  let errors = ''

  if (!isNullHash(contractId)) {
    if (!publication) {
      // Check if the publication exists in db
      errors = `${id} missing publication in db`
    } else if (publication.contract_id !== contractId) {
      // Check that id matches
      errors = [
        `${id} different id in db`,
        publication.contract_id,
        'vs in blockchain',
        contractId
      ].join(' ')
    }
  } else if (publication && publication.status === Publication.STATUS.open) {
    // Check for hanging publication in db
    errors = `${id} open in db and null in blockchain`
  }

  return errors
}

async function getInconsistentParcels(parcels) {
  const service = new ParcelService()
  const faultyParcels = []

  await asyncBatch({
    elements: parcels,
    callback: async (parcelsBatch, batchedCount) => {
      let updatedParcels = []

      try {
        updatedParcels = await service.addOwners(parcelsBatch)
      } catch (error) {
        log.info(`Error processing ${parcelsBatch.length} parcels, skipping`)
        return
      }

      for (const [index, parcel] of parcelsBatch.entries()) {
        const currentOwner = updatedParcels[index].owner

        if (isOwnerMissmatch(currentOwner, parcel)) {
          const { id, owner } = parcel
          log.error(
            `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
          )
          faultyParcels.push(parcel)
        }
      }

      process.stdout.write(
        `- Processed ${batchedCount}/${parcels.length} parcels   \r`
      )
    },
    batchSize: BATCH_SIZE
  })

  return faultyParcels
}

class SanityMonitorCli extends MonitorCli {
  constructor(inconsistencies, ...args) {
    super(...args)
    this.inconsistencies = inconsistencies
  }

  monitor(contractName, eventNames, options) {
    options.watch = false
    return super.monitor(contractName, eventNames, options)
  }

  async processEvents() {
    log.info('Replaying events for inconsistent parcels')

    const inconsistentAssetIds = new Set(
      this.inconsistencies.map(parcel => parcel.asset_id)
    )
    for (const assetId of inconsistentAssetIds) {
      await this.replayEvents(assetId)
    }

    log.info('All done!')
    process.exit()
  }

  async replayEvents(assetId) {
    const events = await BlockchainEvent.findByAssetId(assetId)
    events.reverse()

    for (let i = 0; i < events.length; i++) {
      log.info(
        `[${assetId} - ${i + 1}/${events.length}] Processing ${events[i].name}`
      )
      await processEvent(events[i])
    }
  }
}

function isNullHash(x) {
  const NULL =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  const NULL_PARITY = '0x'
  return x === NULL || x === NULL_PARITY
}

function isOwnerMissmatch(currentOwner, parcel) {
  return !!currentOwner && parcel.owner !== currentOwner
}

//
// Main

if (require.main === module) {
  loadEnv()

  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 100), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(() => cli.runProgram([sanityCheck]))
    .catch(error => console.error('An error occurred.\n', error))
}

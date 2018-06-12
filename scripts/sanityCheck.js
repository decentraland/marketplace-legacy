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
      .option(
        '--self-heal',
        'Try to fix found errors. Supports all flags supported by the monitor, except watch'
      )
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
          inconsistencies = inconsistencies.concat(inconsistentParcels)
        }

        if (options.selfHeal) {
          if (inconsistencies.length) {
            log.info(`Attempting to heal ${inconsistencies.length} parcels`)
            log.info('Retreiving missing events')

            // Hack: change the command name so we can keep the flags but run the monitor
            process.argv = process.argv.map(
              arg => (arg === 'run' ? 'index' : arg)
            )

            await indexMissingEvents(
              (...args) => new SanityMonitorCli(inconsistencies, ...args)
            )
          }
        }
      })
  }
}

async function getInconsistentPublishedParcels(allParcels) {
  const faultyParcels = []

  await asyncBatch({
    elements: allParcels,
    callback: async (parcelsBatch, batchedCount) => {
      const parcels = await Promise.all(
        parcelsBatch.map(async parcel => ({
          ...parcel,
          sanityError: await getPublicationInconsistencies(parcel)
        }))
      )

      for (const parcel of parcels) {
        if (parcel.sanityError) {
          log.info(parcel.sanityError)
          faultyParcels.push(parcel)
        }
      }

      process.stdout.write(
        `- Checked ${batchedCount}/${allParcels.length} parcel publications \r`
      )
    },
    batchSize: BATCH_SIZE,
    retryAttempts: 20
  })

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
        `- Checked ${batchedCount}/${parcels.length} parcels   \r`
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

    const inconsistentciesCache = this.inconsistencies.reduce(
      (cache, parcel) => ({ ...cache, [parcel.id]: parcel }),
      {}
    )
    for (const id in inconsistentciesCache) {
      await this.replayEvents(inconsistentciesCache[id])
    }

    log.info('All done!')
    process.exit()
  }

  async replayEvents(parcel) {
    const events = await BlockchainEvent.findByAssetId(parcel.asset_id)
    events.reverse()

    for (let i = 0; i < events.length; i++) {
      log.info(
        `[${parcel.id}] Processing ${i + 1}/${events.length} ${events[i].name}`
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

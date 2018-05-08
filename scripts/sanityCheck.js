#!/usr/bin/env babel-node

import { eth, contracts } from 'decentraland-eth'
import { Log, env, cli } from 'decentraland-commons'
import { connectDatabase } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { Publication } from '../src/Publication'
import { asyncBatch } from '../src/lib'
import { parseCLICoords } from './utils'

const BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 100), 10)
const log = new Log('sanity-check')

const sanityCheckProgram = {
  addCommands(program) {
    program
      .command('run')
      .option('--skip-parcels', 'Skip the parcel check')
      .option('--check-parcel [parcelId]', 'Check a specific parcel')
      .action(async options => {
        const shouldSkipParcels = options.skipParcels
        const totalChecks = shouldSkipParcels ? 1 : 2
        let conditions = null

        if (options.checkParcel) {
          const [x, y] = parseCLICoords(options.checkParcel)
          conditions = { x, y }
        }
        const parcels = await Parcel.findAll(conditions)

        log.info(
          `[Check 1/${totalChecks}]: Checking Marketplace against all events`
        )
        await checkParcels(parcels)

        if (!shouldSkipParcels) {
          log.info(
            `[Check 2/${totalChecks}]: Checking parcel ownership from -150,-150 to 150,150`
          )
          await processParcels(parcels)
        }

        process.exit()
      })
  }
}

async function checkParcels(parcels) {
  await asyncBatch({
    elements: parcels,
    callback: async (parcelsBatch, batchedCount) => {
      await Promise.all(parcelsBatch.map(parcel => checkParcel(parcel)))
      process.stdout.write(`- ${batchedCount}/${parcels.length}   \r`)
    },
    batchSize: BATCH_SIZE,
    retryAttempts: 20
  })
}

async function checkParcel(parcel) {
  if (!parcel) return

  const { x, y, asset_id } = parcel
  const marketplace = eth.getContract('Marketplace')
  const publication = (await Publication.findInCoordinate(x, y))[0]
  const auction = await marketplace.auctionByAssetId(asset_id)
  const contractId = auction[0]

  if (!isNullHash(contractId)) {
    if (!publication) {
      // Check if the publication exists in db
      log.info(x, y, 'missing publication in db')
    } else if (publication.contract_id !== contractId) {
      // Check that id matches
      log.info(
        x,
        y,
        'different id in db',
        publication.contract_id,
        'vs in blockchain',
        contractId
      )
    }
  } else if (publication && publication.status === Publication.STATUS.open) {
    // Check for hanging publication in db
    log.info(x, y, 'open in db and null in blockchain')
  }
}

async function processParcels(parcels) {
  const service = new ParcelService()

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
        }
      }

      process.stdout.write(
        `- Processed ${batchedCount}/${parcels.length} parcels   \r`
      )
    },
    batchSize: BATCH_SIZE
  })
}

const NULL =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const NULL_PARITY = '0x'

function isNullHash(x) {
  return x === NULL || x === NULL_PARITY
}

function isOwnerMissmatch(currentOwner, parcel) {
  return !!currentOwner && parcel.owner !== currentOwner
}

//
// Main

async function sanityCheck() {
  log.info('Connecting database')
  await connectDatabase()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [
      new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS')),
      new contracts.Marketplace(env.get('MARKETPLACE_CONTRACT_ADDRESS'))
    ],
    provider: env.get('RPC_URL')
  })

  return cli.runProgram([sanityCheckProgram])
}

if (require.main === module) {
  sanityCheck().catch(error => log.error(error))
}

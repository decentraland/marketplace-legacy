#!/usr/bin/env babel-node

import { Log, txUtils, env, eth, contracts, cli } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { Publication } from '../src/Publication'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { asyncBatch } from '../src/lib/asyncBatch'
import { loadEnv } from './utils'
import { decodeAssetId } from './monitor/utils'

const log = new Log('sanity-check')

let BATCH_SIZE

const sanityCheck = {
  addCommands(program) {
    program
      .command('run')
      .option('--fix', 'If present, the errors found will be fixed')
      .option('--skip-parcels', 'Skip the parcel check')
      .action(async options => {
        const shouldFix = options.fix
        const shouldSkipParcels = options.skipParcels
        const totalChecks = shouldSkipParcels ? 1 : 2

        log.info('Connecting database')
        await db.connect()

        log.info('Connecting to Ethereum node')
        await eth.connect({
          contracts: [contracts.LANDRegistry, contracts.Marketplace],
          providerUrl: env.get('RPC_URL')
        })

        log.info(
          `[Check 1/${totalChecks}]: Checking Marketplace against all events`
        )
        try {
          await marketplaceCheck(shouldFix)
        } catch (err) {
          log.error(err, err.stack)
        }

        if (!shouldSkipParcels) {
          log.info(
            `[Check 2/${totalChecks}]: Checking parcel ownership from -150,-150 to 150,150`
          )
          const parcels = await Parcel.find()
          await processParcels(parcels, shouldFix)
        }
      })
  }
}

async function marketplaceCheck(shouldFix) {
  const marketplace = eth.getContract('Marketplace')

  const events = await getAllEvents(marketplace)
  const parcels = getEventParcels(events)

  const tasks = []
  for (let parcel of parcels) {
    tasks.push(
      checkParcel(parcel.parcelId, parcel.lastEvent, marketplace, shouldFix)
    )
  }
  log.info('Analyzing the case of', tasks.length, 'parcels')
  await Promise.all(tasks)
}

function getAllEvents(marketplace) {
  return new Promise((resolve, reject) => {
    marketplace.instance
      .allEvents({
        fromBlock: 0,
        toBlock: 'latest'
      })
      .get(function(error, events) {
        if (error) {
          return reject(error)
        } else {
          return resolve(events)
        }
      })
  })
}

function getEventParcels(events) {
  const results = {}
  for (let event of events) {
    const str = event.args.assetId
    if (!str) continue
    results[str] = { parcelId: event.args.assetId, lastEvent: event }
  }
  return Object.values(results)
}

const NULL =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const NULL_PARITY = '0x'

function isNullHash(x) {
  return x === NULL || x === NULL_PARITY
}

async function checkParcel(parcelId, lastEvent, marketplace, shouldFix) {
  const res = await decodeAssetId(parcelId)
  const [x, y] = Parcel.splitId(res)
  const publication = await Publication.findInCoordinate(x, y)
  const auction = await marketplace.auctionByAssetId(parcelId)

  if (!isNullHash(auction[0])) {
    // Check if the publication exists in db
    if (!publication.length) {
      log.info(x, y, 'missing publication in db')
      if (shouldFix) {
        await insertPublication(x, y, lastEvent)
        log.info(x, y, 'publication fixed')
      }
      return
    }
    // Check that id matches
    const pub = publication[0]
    if (pub.contract_id !== auction[0]) {
      log.info(
        parcelId,
        'different id in db',
        pub.contract_id,
        'vs in blockchain',
        auction[0]
      )
      if (shouldFix) {
        await deletePublication(x, y, pub.owner, pub.tx_hash)
        await insertPublication(x, y, lastEvent)
        log.info(parcelId, 'publication fixed')
      }
      return
    }
  } else if (publication.length) {
    // Check for hanging publication in db
    const pub = publication[0]
    if (pub.status === Publication.STATUS.open) {
      log.info(parcelId, 'open in db and null in blockchain')

      if (shouldFix) {
        await deletePublication(x, y, pub.owner, pub.tx_hash)
        log.info(parcelId, 'publication fixed')
      }
      return
    }
  }
}

function deletePublication(x, y, owner, tx_hash) {
  return Publication.delete({ x, y, owner, tx_hash })
}

function insertPublication(x, y, eventData) {
  const { transactionHash, event } = eventData
  const { seller, priceInWei, expiresAt } = eventData.args
  const contract_id = eventData.args.id

  if (event !== BlockchainEvent.EVENTS.publicationCreated) {
    log.error('Error! Last event received is not AuctionCreated', eventData)
    return
  }
  if (!transactionHash) {
    log.error('Error! Last event received is removed', eventData)
    return
  }

  return Publication.insert({
    tx_status: txUtils.TRANSACTION_STATUS.confirmed,
    status: Publication.STATUS.open,
    owner: seller.toLowerCase(),
    buyer: null,
    price: eth.utils.fromWei(priceInWei),
    expires_at: new Date(parseInt(expiresAt, 10)),
    tx_hash: transactionHash,
    contract_id,
    x,
    y
  })
}

async function processParcels(parcels, shouldFix) {
  log.info(`Processing ${parcels.length} parcels`)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  const service = new ParcelService()

  let errors = []
  let updates = []
  let processedCount = 0

  await asyncBatch({
    elements: parcels,
    callback: async newParcels => {
      let updatedParcels = newParcels.slice()

      try {
        updatedParcels = await service.addOwners(updatedParcels)
        updatedParcels = await service.addLandData(updatedParcels)
      } catch (error) {
        log.info(`Error processing ${newParcels.length} parcels, skipping`)
        errors = errors.concat(newParcels)
        return
      }

      for (const [index, parcel] of newParcels.entries()) {
        const currentOwner = updatedParcels[index].owner

        if (isOwnerMissmatch(currentOwner, parcel)) {
          log.error(
            `Mismatch: owner of '${parcel.id}' is '${
              parcel.owner
            }' on the DB and '${currentOwner}' in blockchain`
          )

          if (shouldFix) {
            const { id, ...attributes } = parcel
            updates.push(Parcel.update(attributes, { id }))
          }
        }
      }

      processedCount += newParcels.length

      log.info(`Processed ${processedCount}/${parcels.length} parcels`)
    },
    batchSize: BATCH_SIZE
  })

  await Promise.all(updates)

  if (errors.length) {
    return await processParcels(errors, shouldFix)
  }
}

function isOwnerMissmatch(currentOwner, parcel) {
  return !!currentOwner && parcel.owner !== currentOwner
}

if (require.main === module) {
  loadEnv()
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 1000), 10)

  Promise.resolve()
    .then(() => cli.runProgram([sanityCheck]))
    .catch(error => console.error('An error occurred.\n', error))
}

#!/usr/bin/env babel-node

import { Log, env, eth, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel, ParcelService } from '../src/Parcel'
import { Publication } from '../src/Publication'
import { asyncBatch } from '../src/lib/asyncBatch'
import { loadEnv } from './utils'
import { decodeAssetId } from './monitor/utils'

const log = new Log('update')

let BATCH_SIZE

export async function sanityCheck() {
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  log.info('Connecting database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  await eth.connect({
    contracts: [contracts.LANDRegistry, contracts.Marketplace],
    providerUrl: env.get('RPC_URL')
  })

  log.info('[Check 1/2]: Checking Marketplace sanity against all events')
  try {
    await marketplaceCheck()
  } catch (err) {
    console.log(err, err.stack)
  }

  log.info('[Check 2/2]: Checking parcel ownership from -150,-150 to 150,150')
  await processParcels()
}

async function marketplaceCheck() {
  const marketplace = eth.getContract('Marketplace')
  const events = await getAllEvents(marketplace)
  const filterParcels = getParcelIds(events)

  const tasks = []
  for (let parcelId of filterParcels) {
    tasks.push(checkParcel(parcelId, marketplace))
  }
  console.log('Analyzing', tasks.length, 'cases of parcels')
  await Promise.all(tasks)
}

function getAllEvents(marketplace) {
  return new Promise((resolve, reject) => {
    marketplace.instance.allEvents({
      fromBlock: 0,
      toBlock: 'latest'
    }).get(function(error, events) {
      if (error) {
        return reject(error)
      } else {
        return resolve(events)
      }
    })
  })
}

function getParcelIds(events) {
  const results = {}
  for (let event of events) {
    const str = event.args.assetId
    if (!str) continue;
    if (results[str]) continue;
    results[str] = event.args.assetId
  }
  return Object.values(results)
}

const NULL = '0x0000000000000000000000000000000000000000000000000000000000000000'

async function checkParcel(parcelId, marketplace) {
  const res = await decodeAssetId(parcelId)
  const [x, y] = res.split(',')
  const publication = await Publication.findInCoordinate(x, y)
  const auction = await marketplace.instance.auctionByAssetId(parcelId)

  if (auction[0] !== NULL) {
    // Check if the publication exists in db
    if (!publication.length) {
      console.log(x, y, 'missing publication in db')
      return
    }
    // Check that id matches
    const pub = publication[0]
    if (pub.contract_id !== auction[0]) {
      console.log(x, y, 'different id in db', pub.contract_id, 'vs in blockchain', auction[0])
      return
    }
  } else if (publication.length) {
    // Check for hanging publication in db
    const pub = publication[0]
    if (pub.status === 'open') {
      console.log(x, y, 'open in db and null in blockchain')
      return
    }
  }
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
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 1000), 10)

  Promise.resolve()
    .then(sanityCheck)
    .then(() => process.exit())
    .catch(error => console.error('An error occurred.\n', error))
}

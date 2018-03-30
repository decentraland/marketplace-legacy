#!/usr/bin/env babel-node

import { env, eth, Log, cli, contracts } from 'decentraland-commons'
import { db } from '../src/database'
import { Parcel } from '../src/Parcel'
import { Publication } from '../src/Publication'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { mockModelDbOperations } from '../specs/utils'
import { loadEnv, parseCLICoords } from './utils'
import { processEvent } from './monitor/persistEvents'

const log = new Log('mktcli')

const main = {
  addCommands(program) {
    program
      .command('decode <assetId>')
      .description('Decode an asset id')
      .action(
        asSafeAction(async assetId => {
          if (!assetId) throw new Error('You need to supply an asset id')

          const contract = eth.getContract('LANDRegistry')
          const coords = await contract.decodeTokenId(assetId)

          log.info(`(decode) str:${assetId} => coords:(${coords})`)
        })
      )

    program
      .command('encode <coord>')
      .description('Encode a (x,y) coordinate to an asset id')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const assetId = await contract.encodeTokenId(x, y)

          log.info(
            `(encode) coords:(${x},${y}) => str:${assetId.toString()} hex:${assetId.toString(
              16
            )}`
          )
        })
      )

    program
      .command('land-owner <coord>')
      .description('Get the land owner of a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const owner = await contract.ownerOfLand(x, y)

          const parcel = await Parcel.findOne({ x, y })
          const dbOwner = parcel.owner || parcel.district_id || 'empty'

          log.info(`(land-owner) coords:(${x},${y})`)
          log.info(`blockchain => ${owner}`)
          log.info(`db         => ${dbOwner}`)
        })
      )

    program
      .command('land-data <coord>')
      .description('Get the land data for a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const data = await contract.landData(x, y)

          const parcel = await Parcel.findOne({ x, y })
          const dbData = toDataLog(parcel.data)

          log.info(`(land-data) coords:(${x},${y})`)
          log.info(`blockchain => ${data}`)
          log.info(`db         => ${dbData}`)
        })
      )

    program
      .command('publication <coord>')
      .description('Get the current publication of a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const assetId = await Parcel.encodeAssetId(x, y)

          const contract = eth.getContract('Marketplace')
          const publication = await contract.auctionByAssetId(assetId)

          const pubDb = (await Publication.findInCoordinate(x, y))[0]
          const publicationDb = toPublicationLog(pubDb)

          log.info(`(publication) coords:(${x},${y})`)
          log.info(`blockchain => ${publication}`)
          log.info(`db         => ${publicationDb}`)
        })
      )

    program
      .command('publications <coord>')
      .description('Get the DB publication history of a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const publications = await Publication.findInCoordinate(x, y)

          log.info(`(publications) coords:(${x},${y})`)

          for (const publication of publications) {
            log.info(toPublicationLog(publication))
          }
        })
      )

    program
      .command('blockchain-events <coord>')
      .option('--show-table-header', 'Show the format for each row')
      .option('--show-tx-hash', 'Show the transaction hash')
      .description('Get chronological blockchain events of a (x,y) coordinate')
      .action(
        asSafeAction(async (coord, options) => {
          const [x, y] = parseCLICoords(coord)
          const assetId = await Parcel.encodeAssetId(x, y)

          const events = await BlockchainEvent.findByAssetId(assetId)
          const eventLog = events.map(event => {
            const { name, block_number, log_index, tx_hash, args } = event
            let log = `${name} (${block_number},${log_index}): `

            if (options.showTxHash) {
              log = `[${tx_hash}] ${log}`
              log = log.padEnd(101)
            } else {
              log = log.padEnd(32)
            }

            switch (name) {
              case BlockchainEvent.EVENTS.publicationCreated:
                log += `with id ${args.id} by ${args.seller} for ${
                  args.priceInWei
                }`
                break
              case BlockchainEvent.EVENTS.publicationCancelled:
                log += `with id ${args.id}`
                break
              case BlockchainEvent.EVENTS.publicationSuccessful:
                log += `with id ${args.id} and winner ${args.winner}`
                break
              case BlockchainEvent.EVENTS.parcelUpdate:
                log += `with data ${args.data}`
                break
              case BlockchainEvent.EVENTS.parcelTransfer:
                log += `to ${args.to}`
                break
              default:
                break
            }

            return log
          })

          if (options.showTableHeader) {
            let header = 'Name (block_number,log_index):  desc'
            if (options.showTxHash) header = '[tx_hash] ' + header

            eventLog.unshift(header)
          }

          log.info(`(blockchain-events) coords:(${x},${y})`)
          log.info('\n- ' + eventLog.join('\n- '))
        })
      )

    program
      .command('replay <coord>')
      .option('--persist', 'Persist replay on the database')
      .description('Replay blockchain events in order')
      .action(
        asSafeAction(async (coord, options) => {
          const [x, y] = parseCLICoords(coord)
          const assetId = await Parcel.encodeAssetId(x, y)
          const events = await BlockchainEvent.findByAssetId(assetId)
          events.reverse()

          if (!options.persist) {
            mockModelDbOperations()
          }

          for (let i = 0; i < events.length; i++) {
            log.info(`[${i + 1}/${events.length}] Processing ${events[i].name}`)
            await processEvent(events[i])
          }
        })
      )

    program
      .command('clean-publications <coord>')
      .description('Remove all publications for a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          log.info('Deleting publications')
          await Publication.delete({ x, y })
        })
      )

    program
      .command('truncate [tableNames...]')
      .description('Truncate DB tables')
      .action(async tableNames => {
        log.info(`Truncating ${tableNames.length} tables`)
        await Promise.all(tableNames.map(tableName => db.truncate(tableName)))
        process.exit()
      })
  }
}

function asSafeAction(callback) {
  return async function(...args) {
    try {
      await callback(...args)
    } catch (error) {
      log.error('ERR: ' + error.message)
      console.log(error)
    }
    process.exit()
  }
}

function toPublicationLog(publication) {
  return publication
    ? [
        publication.contract_id,
        publication.owner,
        eth.utils.toWei(publication.price),
        publication.expires_at.getTime(),
        publication.status
      ].join(',')
    : 'empty'
}

function toDataLog(data) {
  return Object.keys(data) > 1
    ? contracts.LANDRegistry.encodeLandData(data)
    : 'empty'
}

//
// Main

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => {
      log.debug('Connecting to Database')
      return db.connect()
    })
    .then(() => {
      log.debug('Connecting to Ethereum node')
      return eth.connect({
        contracts: [contracts.LANDRegistry, contracts.Marketplace],
        providerUrl: env.get('RPC_URL')
      })
    })
    .then(() => cli.runProgram([main]))
    .catch(error => {
      log.error(error)
      process.exit()
    })
}

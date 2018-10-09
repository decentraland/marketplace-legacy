#!/usr/bin/env babel-node

import { eth, txUtils, contracts } from 'decentraland-eth'
import { Log, cli } from 'decentraland-commons'

import { db } from '../src/database'
import { connectEth } from '../src/ethereum'
import { Parcel } from '../src/Asset'
import { Publication } from '../src/Publication'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { mockModelDbOperations } from '../specs/utils'
import { loadEnv, parseCLICoords } from './utils'
import { processEvent } from '../monitor/processEvents'

const log = new Log('mktcli')

const main = {
  addCommands(program) {
    program
      .command('decode <tokenId>')
      .description('Decode an asset id')
      .action(
        asSafeAction(async tokenId => {
          if (!tokenId) throw new Error('You need to supply an token id')

          const contract = eth.getContract('LANDRegistry')
          const coords = await contract.decodeTokenId(tokenId)

          log.info(`(decode) str:${tokenId} => coords:(${coords})`)
        })
      )

    program
      .command('encode <coord>')
      .description('Encode a (x,y) coordinate to an asset id')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const tokenId = await contract.encodeTokenId(x, y)

          log.info(
            `(encode) coords:(${x},${y}) => str:${tokenId.toString()} hex:${tokenId.toString(
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
      .command('land-estate <coord>')
      .description('Get estate info for a LAND (x,y)')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('EstateRegistry')
          const tokenId = await Parcel.encodeTokenId(x, y)

          const estateId = await contract.getLandEstateId(tokenId)

          log.info(`(land-estate) coords:(${x},${y}) => estateId: ${estateId}`)
        })
      )

    program
      .command('land-update-operator <coord>')
      .description('Get the LAND operator of a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const tokenId = await contract.encodeTokenId(x, y)
          const operator = await contract.updateOperator(tokenId)

          log.info(`(land-update-operator) coords:(${x},${y})`)
          log.info(`blockchain => ${operator}`)
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
      .command('land-assign <coord> <owner>')
      .description('Assign a new parcel (x,y) to an account')
      .action(
        asSafeAction(async (coord, owner) => {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')

          await unlockAccountWithPrompt()
          const txHash = await contract.assignNewParcel(x, y, owner)

          log.info(`(land-assign) coords:(${x},${y}) => owner: ${owner}`)
          log.info(`(land-assign) tx:${txHash}`)
        })
      )

    program
      .command('publication <coord>')
      .description('Get the current publication of a (x,y) coordinate')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const id = Parcel.buildId(x, y)
          const tokenId = await Parcel.encodeTokenId(x, y)

          const contract = eth.getContract('LegacyMarketplace')
          const publication = await contract.auctionByAssetId(tokenId)

          const pubDb = (await Publication.findByAssetId(id))[0]
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
          const id = Parcel.buildId(x, y)
          const publications = await Publication.findByAssetId(id)

          log.info(`(publications) coords:(${x},${y})`)

          for (const publication of publications) {
            log.info(toPublicationLog(publication))
          }
        })
      )

    program
      .command('publication-cancel <coord>')
      .description('Cancel a publication (x,y)')
      .action(
        asSafeAction(async coord => {
          const [x, y] = parseCLICoords(coord)
          const tokenId = await Parcel.encodeTokenId(x, y)
          const contract = eth.getContract('Marketplace')

          await unlockAccountWithPrompt()
          const txHash = await contract.cancelOrder(tokenId)

          log.info(`(publication-cancel) coords:(${x},${y})`)
          log.info(`(publication-cancel) tx:${txHash}`)
        })
      )

    program
      .command('blockchain-events <coord>')
      .option('--show-table-header', 'Show the format for each row')
      .option('--show-tx-hash', 'Show the transaction hash')
      .description('Get chronological blockchain events of a (x,y) coordinate')
      .action(
        asSafeAction(async (coord, options) => {
          const events = BlockchainEvent.getEvents()
          const [x, y] = parseCLICoords(coord)
          const tokenId = await Parcel.encodeTokenId(x, y)

          const blockchainEvents = await BlockchainEvent.findByArgs(
            'assetId',
            tokenId
          )
          blockchainEvents.reverse()

          const eventLog = blockchainEvents.map(event => {
            const { name, block_number, log_index, tx_hash, args } = event
            let log = `${name} (${block_number},${log_index}): `

            if (options.showTxHash) {
              log = `[${tx_hash}] ${log}`
              log = log.padEnd(101)
            } else {
              log = log.padEnd(32)
            }

            switch (name) {
              case events.publicationCreated:
                log += `with id ${args.id} by ${args.seller} for ${
                  args.priceInWei
                }`
                break
              case events.publicationCancelled:
                log += `with id ${args.id}`
                break
              case events.publicationSuccessful:
                log += `with id ${args.id} and winner ${args.winner}`
                break
              case events.parcelUpdate:
                log += `with data ${args.data}`
                break
              case events.parcelTransfer:
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
      .option('--clean', 'Clean publications before replaying')
      .description('Replay blockchain events in order')
      .action(
        asSafeAction(async (coord, options) => {
          const [x, y] = parseCLICoords(coord)
          const tokenId = await Parcel.encodeTokenId(x, y)
          const events = await BlockchainEvent.findByArgs('assetId', tokenId)

          if (!options.persist) {
            mockModelDbOperations()
          }

          if (options.clean) {
            log.info(`Cleaning publications for ${coord}`)
            await Publication.deleteByAsset({ id: Parcel.buildId(x, y) })
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
          await Publication.delete({ x, y })
          log.info(
            `(clean-publications) publications deleted. coords:(${x},${y})`
          )
        })
      )

    program
      .command('truncate [tableNames...]')
      .description('Truncate DB tables')
      .action(
        asSafeAction(async tableNames => {
          log.info(`(truncate) truncating ${tableNames.length} tables`)
          await Promise.all(tableNames.map(tableName => db.truncate(tableName)))
        })
      )

    program
      .command('tx-status <txHash>')
      .description(
        'Fetch information about the transaction hash from the blockchain'
      )
      .option('--expand-events', 'Show arguments for each fired event')
      .action(
        asSafeAction(async (txHash, options) => {
          const tx = await txUtils.getTransaction(txHash)

          if (tx) {
            log.info('(tx-status) tx\n', tx)

            if (tx.recepeit) {
              log.info('(tx-status) recepeit\n', tx.recepeit)

              if (options.expandEvents) {
                tx.recepeit.logs.map(txLog =>
                  log.info(txLog.name, '\n', txLog.events)
                )
              }
            } else {
              log.info('(tx-status) recepeit not found, maybe not mined yet')
            }
          } else {
            log.info('(tx-status) tx not found')
          }
        })
      )
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
        publication.expires_at,
        publication.status
      ].join(',')
    : 'empty'
}

function toDataLog(data) {
  return Object.keys(data) > 1
    ? contracts.LANDRegistry.encodeLandData(data)
    : 'empty'
}

async function unlockAccountWithPrompt() {
  const answers = await cli.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Write the account password to unlock:',
      default: ''
    }
  ])
  await eth.wallet.unlockAccount(answers['password'])
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
      return connectEth()
    })
    .then(() => cli.runProgram([main]))
    .catch(error => {
      log.error(error)
      process.exit(1)
    })
}

#!/usr/bin/env babel-node

import { eth, txUtils, contracts } from 'decentraland-eth'
import { Log, cli } from 'decentraland-commons'

import { SQL, db } from '../src/database'
import { connectEth } from '../src/ethereum'
import { Parcel, Estate } from '../src/Asset'
import { Publication } from '../src/Publication'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { eventNames } from '../src/ethereum'
import { mockModelDbOperations } from '../specs/utils'
import { ASSET_TYPES } from '../shared/asset'
import { processEvent } from '../monitor/processEvents'
import { loadEnv, parseCLICoords } from './utils'

const log = new Log('mktcli')
const POSSIBLE_ASSET_EVENT_IDS = [
  'assetId',
  'landId',
  '_landId',
  '_tokenId',
  '_estateId'
]

const main = {
  addCommands(program) {
    program
      .command('asset <assetId> <assetType>')
      .description('Get the db representation of an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)
          log.info(asset)
        })
      )

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
      .command('asset-owner <assetId> <assetType>')
      .description('Get the owner of an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)

          const contract = getContractByAssetType(assetType)
          const owner = await contract.ownerOf(asset.token_id)

          const dbOwner = asset.owner || asset.district_id || 'empty'

          log.info(`(asset-owner) id:(${asset.id})`)
          log.info(`blockchain => ${owner}`)
          log.info(`db         => ${dbOwner}`)
        })
      )

    program
      .command('asset-update-operator <assetId> <assetType>')
      .description('Get the update operator of an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)
          const contract = getContractByAssetType(assetType)

          const operator = await contract.updateOperator(asset.token_id)

          log.info(`(asset-update-operator) id:(${asset.id})`)
          log.info(`blockchain => ${operator}`)
        })
      )

    program
      .command('asset-data <assetId> <assetType>')
      .description('Get the data for an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)
          const contract = getContractByAssetType(assetType)

          const data = await contract.tokenMetadata(asset.token_id)
          const dbData = toDataLog(asset.data)

          log.info(`(asset-data) id:(${asset.id})`)
          log.info(`blockchain => ${data}`)
          log.info(`db         => ${dbData}`)
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
      .command('publication <assetId> <assetType>')
      .description('Get the current publication of an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)

          const legacyContract = eth.getContract('LegacyMarketplace')
          const legacyPublication = await legacyContract.auctionByAssetId(
            asset.token_id
          )

          const registryContract = getContractByAssetType(assetType)
          const contract = eth.getContract('Marketplace')
          const publication = await contract.orderByAssetId(
            registryContract.address,
            asset.token_id
          )

          const pubDb = (await Publication.findByAssetId(asset.id))[0]
          const publicationDb = toPublicationLog(pubDb)

          log.info(`(publication) id:(${asset.id})`)
          log.info(`blockchain legacy => ${legacyPublication}`)
          log.info(`blockchain        => ${publication}`)
          log.info(`db                => ${publicationDb}`)
        })
      )

    program
      .command('publications <assetId> <assetType>')
      .description('Get the DB publication history of an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)
          const publications = await Publication.findByAssetId(asset.id)

          log.info(`(publications) id:(${asset.id})`)

          for (const publication of publications) {
            log.info(toPublicationLog(publication))
          }
        })
      )

    program
      .command('publication-cancel <assetId> <assetType>')
      .description('Cancel a publication')
      .option('--is-legacy', 'You are using the legacy marketplace')
      .action(
        asSafeAction(async (assetId, assetType, options) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)
          const registryContract = getContractByAssetType(assetType)

          const contractName = options.isLegacy
            ? 'LegacyMarketplace'
            : 'Marketplace'
          const contract = eth.getContract(contractName)

          await unlockAccountWithPrompt()

          const txHash = options.isLegacy
            ? await contract.cancelOrder(asset.token_id)
            : await contract.cancelOrder(
                registryContract.address,
                asset.token_id
              )

          log.info(`(publication-cancel) id:(${asset.id})`)
          log.info(`(publication-cancel) contract:(${contractName})`)
          log.info(`(publication-cancel) tx:${txHash}`)
        })
      )

    program
      .command('blockchain-events <assetId> <assetType>')
      .option('--show-table-header', 'Show the format for each row')
      .option('--show-tx-hash', 'Show the transaction hash')
      .description('Get chronological blockchain events of an asset')
      .action(
        asSafeAction(async (assetId, assetType, options) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)

          const blockchainEvents = await BlockchainEvent.findByAnyArgs(
            POSSIBLE_ASSET_EVENT_IDS,
            asset.token_id
          )
          blockchainEvents.reverse()

          const eventLogPromises = blockchainEvents.map(async event => {
            const { name, block_number, log_index, tx_hash, args } = event
            let log = `${name} (${block_number},${log_index}): `

            if (options.showTxHash) {
              log = `[${tx_hash}] ${log}`
              log = log.padEnd(101)
            } else {
              log = log.padEnd(32)
            }

            switch (name) {
              case eventNames.CreateEstate:
                log += `with data ${args._data}`
                break
              case eventNames.AuctionCreated:
              case eventNames.OrderCreated:
                log += `with id ${args.id} by ${args.seller} for ${
                  args.priceInWei
                }`
                break
              case eventNames.AuctionCancelled:
              case eventNames.OrderCancelled:
                log += `with id ${args.id}`
                break
              case eventNames.AuctionSuccessful:
              case eventNames.OrderSuccessful:
                log += `with id ${args.id} and winner ${args.winner ||
                  args.buyer}`
                break
              case eventNames.Update:
                log += `with data ${args.data}`
                break
              case eventNames.Transfer:
                log += `to ${args.to || args._to}`
                break
              case eventNames.AddLand:
                log += `added ${await Parcel.decodeTokenId(args._landId)}`
                break
              case eventNames.RemoveLand:
                log += `removed ${await Parcel.decodeTokenId(args._landId)}`
                break
              case eventNames.UpdateOperator:
                log += `with operator ${args._operator}`
                break
              default:
                break
            }

            return log
          })
          const eventLog = await Promise.all(eventLogPromises)

          if (options.showTableHeader) {
            let header = 'Name (block_number,log_index):  desc'
            if (options.showTxHash) header = '[tx_hash] ' + header

            eventLog.unshift(header)
          }

          log.info(`(blockchain-events) id:(${asset.id})`)
          log.info('\n- ' + eventLog.join('\n- '))
        })
      )

    program
      .command('replay <assetId> <assetType>')
      .option('--persist', 'Persist replay on the database')
      .option('--clean', 'Clean publications before replaying')
      .description('Replay blockchain events in order')
      .action(
        asSafeAction(async (assetId, assetType, options) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)

          const events = await BlockchainEvent.findByAnyArgs(
            POSSIBLE_ASSET_EVENT_IDS,
            asset.token_id
          )

          if (!options.persist) {
            mockModelDbOperations()
          }

          if (options.clean) {
            log.info(`Cleaning publications for ${asset.id}`)
            await Publication.deleteByAssetId(asset.id)
          }

          for (let i = 0; i < events.length; i++) {
            log.info(`[${i + 1}/${events.length}] Processing ${events[i].name}`)
            await processEvent(events[i])
          }
        })
      )

    program
      .command('clean-publications <assetId> <assetType>')
      .description('Remove all publications for an asset')
      .action(
        asSafeAction(async (assetId, assetType) => {
          const asset = await getAssetFromCLIArgs(assetId, assetType)

          await Publication.deleteByAssetId(asset.id)
          log.info(
            `(clean-publications) publications deleted. id:(${asset.id})`
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
      .command('delete-monitor-data')
      .description('Reset database data')
      .action(
        asSafeAction(async () => {
          log.info('(delete-monitor-data) deleting database data')
          const truncateTableNames = [
            'blockchain_events',
            'publications',
            'mortgages'
          ]
          const deleteTableNames = ['estates']

          await db.query(
            SQL`UPDATE ${SQL.raw(
              Parcel.tableName
            )} SET estate_id = NULL WHERE estate_id IS NOT NULL`
          )
          await Promise.all(
            truncateTableNames.map(tableName => db.truncate(tableName))
          )
          await Promise.all(
            deleteTableNames.map(tableName =>
              db.query(`DELETE FROM ${tableName}`)
            )
          )
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

async function getAssetFromCLIArgs(assetId, assetType) {
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = parseCLICoords(assetId)
      return Parcel.findOne({ x, y })
    }
    case ASSET_TYPES.estate: {
      return Estate.findOne(assetId)
    }
    default:
      throw new Error(`The assetType ${assetType} is invalid`)
  }
}

function getContractByAssetType(assetType) {
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      return eth.getContract('LANDRegistry')
    }
    case ASSET_TYPES.estate: {
      return eth.getContract('EstateRegistry')
    }
    default:
      throw new Error(`The assetType ${assetType} is invalid`)
  }
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

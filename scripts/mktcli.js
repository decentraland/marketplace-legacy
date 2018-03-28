#!/usr/bin/env babel-node

import { eth, Log, cli, contracts } from 'decentraland-commons'
import { loadEnv } from './utils'
import { decodeAssetId, encodeAssetId, parseCLICoords } from './monitor/utils'

const log = new Log('mktcli')
const logError = err => log.error('ERR: ' + err.message)

const main = {
  addCommands(program) {
    program
      .command('decode <assetId>')
      .description('Decode an asset id')
      .action(async assetId => {
        if (!assetId) return log.warn('You need to supply an asset id')

        try {
          const coords = await decodeAssetId(assetId)
          log.info(`(decode) str:${assetId} => coords:(${coords})`)
        } catch (err) {
          logError(err)
        }
      })

    program
      .command('encode <coord>')
      .description('Encode a (x,y) coordinate to an asset id')
      .action(async coord => {
        if (!coord) return log.warn('You need to supply a coordinate')

        try {
          const [x, y] = parseCLICoords(coord)
          const assetId = await encodeAssetId(x, y)
          log.info(
            `(encode) coords:(${x},${y}) => str:${assetId.toString()} hex:${assetId.toString(
              16
            )}`
          )
        } catch (err) {
          logError(err)
        }
      })

    program
      .command('land-owner <coord>')
      .description('Get the land owner of a (x,y) coordinate')
      .action(async coord => {
        if (!coord) return log.warn('You need to supply a coordinate')

        try {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const owner = await contract.ownerOfLand(x, y)
          log.info(`(land-owner) coords:(${x},${y}) => ${owner}`)
        } catch (err) {
          logError(err)
        }
      })

    program
      .command('land-data <coord>')
      .description('Get the land data for a (x,y) coordinate')
      .action(async coord => {
        if (!coord) return log.warn('You need to supply a coordinate')

        try {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('LANDRegistry')
          const data = await contract.landData(x, y)
          log.info(`(land-data) coords:(${x},${y}) => ${data}`)
        } catch (err) {
          logError(err)
        }
      })

    program
      .command('publication <coord>')
      .description('Get the current publication of a (x,y) coordinate')
      .action(async coord => {
        if (!coord) return log.warn('You need to supply a coordinate')

        try {
          const [x, y] = parseCLICoords(coord)
          const contract = eth.getContract('Marketplace')
          const assetId = await encodeAssetId(x, y)
          const publication = await contract.auctionByAssetId(assetId)
          log.info(`(publication) coords:(${x},${y}) => ${publication}`)
        } catch (err) {
          logError(err)
        }
      })
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => {
      log.debug('Connecting to Ethereum node')
      return eth.connect({
        contracts: [contracts.LANDRegistry, contracts.Marketplace]
      })
    })
    .then(() => cli.runProgram([main]))
    .catch(error => {
      log.error(error)
      process.exit()
    })
}

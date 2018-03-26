#!/usr/bin/env babel-node

import { eth, Log, cli, contracts } from 'decentraland-commons'
import { loadEnv } from './utils'
import { decodeAssetId, encodeAssetId } from './monitor/utils'

const log = new Log('mktcli')

const logError = err => log.error('ERR: ' + err.message)
const parseCoords = coords =>
  coords
    .replace('(', '')
    .replace(')', '')
    .split(',')

const landRegistry = () => eth.getContract('LANDRegistry')
const marketplace = () => eth.getContract('Marketplace')

const main = {
  addCommands(program) {
    program.command('decode').action(async options => {
      if (!options.length) return

      try {
        const coords = await decodeAssetId(options)
        log.info(`(decode) str:${options} => coords:(${coords})`)
      } catch (err) {
        logError(err)
      }
    })

    program.command('encode').action(async options => {
      if (!options.length) return

      try {
        const [x, y] = parseCoords(options)
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

    program.command('land-owner').action(async options => {
      if (!options.length) return

      try {
        const [x, y] = parseCoords(options)
        const contract = landRegistry()
        const owner = await contract.ownerOfLand(x, y)
        log.info(`(land-owner) coords:(${x},${y}) => ${owner}`)
      } catch (err) {
        logError(err)
      }
    })

    program.command('land-data').action(async options => {
      if (!options.length) return

      try {
        const [x, y] = parseCoords(options)
        const contract = landRegistry()
        const data = await contract.landData(x, y)
        log.info(`(land-data) coords:(${x},${y}) => ${data}`)
      } catch (err) {
        logError(err)
      }
    })

    program.command('publication').action(async options => {
      if (!options.length) return

      try {
        const [x, y] = parseCoords(options)
        const contract = marketplace()
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

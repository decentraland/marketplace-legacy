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

const main = {
  addCommands(program) {
    program.command('decode').action(async options => {
      if (!options.length) return

      try {
        const value = await decodeAssetId(options)
        log.info(`(decode) str:${options} => coords:(${value})`)
      } catch (err) {
        logError(err)
      }
    })

    program.command('encode').action(async options => {
      if (!options.length) return

      try {
        const [x, y] = parseCoords(options)
        const value = await encodeAssetId(x, y)
        log.info(
          `(encode) coords:(${x},${y}) => str:${value.toString()} hex:${value.toString(
            16
          )}`
        )
      } catch (err) {
        logError(err)
      }
    })

    program.command('owner').action(async options => {
      if (!options.length) return

      const [x, y] = parseCoords(options)
      const contract = eth.getContract('LANDRegistry')
      const owner = await contract.ownerOfLand(x, y)
      log.info(`(owner) coords:(${x},${y}) => ${owner}`)
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

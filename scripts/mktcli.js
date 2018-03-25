import { eth, Log, cli, contracts } from 'decentraland-commons'
import { loadEnv } from './utils'
import { decodeAssetId, encodeAssetId } from './monitor/utils'

const log = new Log('mktcli')

const logError = err => log.error('ERR: ' + err.message)

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
        const [x, y] = options
          .replace('(', '')
          .replace(')', '')
          .split(',')
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
  }
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(() => {
      log.debug('Connecting to Ethereum node')
      return eth.connect({
        contracts: [contracts.LANDRegistry]
      })
    })
    .then(() => cli.runProgram([main]))
    .catch(error => {
      log.error(error)
      process.exit()
    })
}

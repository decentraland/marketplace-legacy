#!/usr/bin/env babel-node

import { cli, env, Log } from 'decentraland-commons'
import * as handlers from './handlers'
import { MonitorActions } from './MonitorActions'
import { connectEth } from '../src/ethereum'
import { db } from '../src/database'
import { loadEnv } from '../scripts/utils'

const log = new Log('main')

export async function main(getActions = createMonitorActions) {
  log.info('Connecting to database')
  await db.connect()

  log.info('Connecting to Ethereum node')
  const contractsData = await connectEth()

  log.info('Starting CLI')
  const eventsDelay = Number(env.get('PROCESS_EVENTS_DELAY', 2 * 60 * 1000)) // 2 minutes
  const monitorActions = getActions(handlers, contractsData, eventsDelay)

  cli.runProgram([getProgram(monitorActions)])
}

function getProgram(actions) {
  return {
    addCommands(program) {
      program
        .command('index')
        .option(
          '--args [args]',
          'JSON string containing args to filter by. Defaults to {}'
        )
        .option(
          '--from-block [fromBlock]',
          'The number of the earliest block. Defaults to 0'
        )
        .option(
          '--to-block [toBlock]',
          'The number of the latest block. Defaults to `latest`'
        )
        .option(
          '--address [address]',
          'An address to only get logs from particular account(s).'
        )
        .option(
          '-w, --watch',
          'Keep watching the blockchain for new events after --to-block.'
        )
        .option(
          '--skip-process',
          'Only restore the stored events, without processing each one'
        )
        .allowUnknownOption()
        .action(options => actions.index(options))
    }
  }
}

function createMonitorActions(...args) {
  return new MonitorActions(...args)
}

if (require.main === module) {
  loadEnv('../src/.env')

  Promise.resolve()
    .then(main)
    .catch(console.error)
}

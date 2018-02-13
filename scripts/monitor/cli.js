#!/usr/bin/env babel-node

import { cli, Log } from 'decentraland-commons'
import { EventMonitor } from './EventMonitor'

const log = new Log('CLI')

export class Cli {
  constructor(handlers) {
    this.handlers = handlers
  }

  run() {
    return cli.runProgram([this])
  }

  // Overrideable, used by cli.runProgram
  addCommands(program) {
    this.defineCommand('transform', program)
  }

  defineCommand(commandName, program) {
    const command = program.command(
      `${commandName} <contractName> [eventNames...]`
    )

    return this.addOptions(command).action(
      (contractName, eventNames, options) => {
        const eventMonitor = new EventMonitor(contractName, eventNames)

        eventMonitor.run(options, (error, logs) => {
          if (error) {
            log.error(
              `Unexpected error returned by the blockchain while monitoring "${contractName}" for "${eventNames}" events`
            )
          } else {
            const handler =
              this.handlers[options.handlerName] ||
              this.getHandler(commandName, contractName, eventNames)

            if (!handler) {
              throw new Error('Could not find a handler for this action')
            }

            handler(logs) // may be async
          }
        })
      }
    )
  }

  addOptions(program) {
    return program
      .option(
        '--handler [handlerName]',
        'Which handler to use for the incoming data. It will try to deceduce it from the arguments'
      )
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
  }

  getHandler(commandName, contractName, eventNames) {
    const parts = [commandName, contractName, eventNames.join('_')]

    for (let i = 0; i < parts.length; i++) {
      const handlerName = parts.slice(i).join('_')
      const handler = this.handlers[handlerName]

      if (handler) {
        return handler
      }
    }
  }
}

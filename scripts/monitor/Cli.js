#!/usr/bin/env babel-node

import { cli, Log } from 'decentraland-commons'
import { HandlersIndex } from './handlers'
import { EventMonitor } from './EventMonitor'

const log = new Log('Cli')

export class Cli {
  /**
   * @param  {object} handlers - Hash of functions to execute depending on the prop name
   * @return {Cli} instance
   */
  constructor(handlers) {
    this.handlers = new HandlersIndex(handlers)
  }

  /**
   * Start the CLI
   */
  run() {
    cli.runProgram([this])
  }

  /**
   * Define commands to be used whenever `run` is called
   * If you're extending the Cli, you can override this method to add your own API
   * @param {object} program - commander.js {@link https://github.com/tj/commander.js} program supplied on `cli.runProgram`
   */
  addCommands(program) {
    this.defineCommand('transform', program)
  }

  /**
   * Defines a new command.
   * It uses EventMonitor to check the Blockchain. It handles the event with one of the handlers supplied on the constructor
   * It'll use the options defined by `addOptions`
   * @param  {string} commandName
   * @param  {object} program     - commander.js {@link https://github.com/tj/commander.js} program supplied on `cli.runProgram`.
   * @return {object} command
   */
  defineCommand(commandName, program) {
    const command = program.command(
      `${commandName} <contractName> [eventNames...]`
    )

    return this.addOptions(command).action(
      (contractName, eventNames, options) => {
        const eventMonitor = new EventMonitor(contractName, eventNames)
        const handler = this.handlers.get(commandName, contractName, eventNames)

        if (!handler) throw new Error('Could not find a valid handler')

        eventMonitor.run(options, async (error, logs) => {
          if (error) {
            log.error(`Error monitoring "${contractName}" for "${eventNames}"`)
            log.error(error)
          } else {
            await handler(logs)
          }
        })
      }
    )
  }

  /**
   * Add predefined options to the supplied program to be used on a command
   * @param  {object} program - commander.js {@link https://github.com/tj/commander.js} program supplied on `cli.runProgram`.
   */
  addOptions(program) {
    return program
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
}

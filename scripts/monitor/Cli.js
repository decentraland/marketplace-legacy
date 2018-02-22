import { cli } from 'decentraland-commons'
import { HandlersIndex } from './handlers'

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
    // Override on subclasses
  }

  /**
   * Defines a new command. It'll use the options defined by `addOptions`.
   * @param  {string} commandName
   * @param  {object} program     - commander.js {@link https://github.com/tj/commander.js} program supplied on `cli.runProgram`.
   * @param  {function} callback  - function to run when the command is executed
   * @return {object} command
   */
  defineCommand(commandName, program, callback) {
    const command = program.command(
      `${commandName} <contractName> [eventNames...]`
    )

    return this.addOptions(command).action((...args) => callback(...args))
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

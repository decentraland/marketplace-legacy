
# Blockchain Monitor

This module is composed of a few composable parts. The following is an explanation of each file and it's purpose

### EventMonitor

It handles contract events and has a unified API to get or watch them. It uses the contracts defined on [decentraland-commons](https://github.com/decentraland/commons) to obtain the events.

```javascript
const eventMonitor = new EventMonitor('ContractName', ['InterestingEvent', ...])
const options = {
  watch: true,
  fromBlock: 0,
  toBlock: 'latest'
}
eventMonitor.run(options, (error, logs) => {
    // Do something with the events
})
```

### Cli

By default it'll generate a command line method called `transform` which serves as a generic entry point for processing events. The `Cli` will look for a handler that matches the following name progression:

```bash
# File search progression:
#   - action_contract_[events_...]
#   - contract_[events_...]
#   - [events...]

./monitor/index.js transform LANDRegistry Transfer --watch
# transform_LANDRegistry_Transfer
# LANDRegistry_Transfer
# Transfer
```

In short, it has two main purposes:

- Eases the definition of command line interfaces to manage event processing. It does this by adding the command line flags that correspond with the `EventMonitor#run` options argument
- Uses the handlers defined on the constructor to abstract the logic of actually getting the events with it's processing.

It can be extended either by using it as a base class:

```javascript
class MyCli extends Cli {
  addCommands(program) {
    // If you want to rename the base command but keep the event handling
    this.defineCommand('awesome-command', program)
    
    // If you want to keep the options but don't want to use handlers
    this.addOptions(
      program.command(`fantastic-command <contractName> [eventNames...]`)
    ).action(() => ({}))

    // If you just want to use handlers
    program
      .command(`incredible-command <contractName> [eventNames...]`)
      .action((...args) => {
        this.handlers['some-handler']()
      })
  }
}
```


### /handlers

#### HandlersIndex

Simple class used by the `Cli` to get the correct handler from the command arguments

#### index.js

Each handler's purpose is to decouple how the event is obtained from how is processed. This allows the handlers to be a lot more testeable.

For example:

```javascript
export function transform_Marketplace_Publish(event) {
    fs.writeFile(`./event-${event.event}.json`, JSON.stringify(event), 'utf8')
}
```

### index.js

This is the main entry point. It setups all necessary components to run the program.

This particular example sets up the database, Eteherum node connection before using handlers defined on the `./handlers` folder, which are supplied to the `Cli` constructor later on.

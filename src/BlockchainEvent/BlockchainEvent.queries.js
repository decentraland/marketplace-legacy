import { SQL, raw } from '../database'

export const BlockchainEventQueries = Object.freeze({
  byAddress: address => (address ? SQL`address = ${address}` : SQL`1 = 1`),
  byEventName: name => (name ? SQL`name = ${name}` : SQL`1 = 1`),
  byMultipleArgs: args => {
    console.log(
      args,
      BlockchainEventQueries.byArgs(args[0].name, args[0].value)
    )
    return args.length > 0
      ? args
          .slice(1)
          .reduce(
            (query, arg) =>
              query.append(SQL` AND args->>'${raw(arg.name)}' = ${arg.value}`),
            BlockchainEventQueries.byArgs(args[0].name, args[0].value)
          )
      : SQL`1 = 1`
  },
  byArgs: (argName, value) => SQL`args->>'${raw(argName)}' = ${value}`,
  byAnyArgs: (argNames, value) =>
    argNames
      .slice(1)
      .reduce(
        (query, argName) =>
          query.append(SQL` OR args->>'${raw(argName)}' = ${value}`),
        BlockchainEventQueries.byArgs(argNames[0], value)
      ),
  fromBlock: fromBlock =>
    fromBlock ? SQL`block_number >= ${fromBlock}` : SQL`1 = 1`,
  toBlock: toBlock =>
    toBlock && toBlock != 'latest'
      ? SQL`block_number <= ${toBlock}`
      : SQL`1 = 1`
})

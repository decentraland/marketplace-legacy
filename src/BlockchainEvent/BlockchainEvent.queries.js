import { BlockchainEvent } from './BlockchainEvent.model'
import { SQL, raw } from '../database'

export const BlockchainEventQueries = Object.freeze({
  byArgs: (argName, value) => SQL`args->>'${raw(argName)}' = ${value}`,
  byAnyArgs: (argNames, value) =>
    argNames
      .slice(1)
      .reduce(
        (query, argName) =>
          query.append(SQL` OR args->>'${raw(argName)}' = ${value}`),
        BlockchainEventQueries.byArgs(argNames[0])
      )
})

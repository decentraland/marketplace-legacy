import { env } from 'decentraland-commons'

import { SQL } from '../database'
import { BlockchainEventQueries } from '../BlockchainEvent'

export const ClaimNameQueries = Object.freeze({
  areClaimNameEvents: owner => {
    const address = env
      .get('AVATAR_NAME_REGISTRY_CONTRACT_ADDRESS')
      .toLowerCase()

    // prettier-ignore
    return SQL`${BlockchainEventQueries.byArgs('_owner', owner)} AND address = ${address}`
  }
})

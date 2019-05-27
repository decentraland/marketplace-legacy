import { env } from 'decentraland-commons'

import { eventNames } from '../../src/ethereum'

export const ApprovalQueries = Object.freeze({
  areManaEvents: () => {
    const address = env.get('MANA_TOKEN_CONTRACT_ADDRESS')
    // prettier-ignore
    return `address = ${address} and name = ${eventNames.Approval}`
  }
})

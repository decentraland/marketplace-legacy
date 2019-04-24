import { Log } from 'decentraland-commons'

import { Approval } from '../../src/Approval'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { APPROVAL_TYPES } from '../../shared/approval'

const log = new Log('approvalReducer')

export async function approvalReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.LANDRegistry: {
      await reduceLANDRegistry(event)
      break
    }
    case contractAddresses.EstateRegistry: {
      await reduceEstateRegistry(event)
      break
    }
    default:
      break
  }
}

async function reduceLANDRegistry(event) {
  const { name, address } = event

  switch (name) {
    case eventNames.ApprovalForAll: {
      // operator and holder are inverted in the contact
      const owner = event.args.holder.toLowerCase()
      const operator = event.args.operator.toLowerCase()
      const authorized = event.args.authorized === 'true'
      const action = authorized ? 'set' : 'remove'

      log.info(`[${name}] ${holder} ${action} ${operator} as approved for all`)

      try {
        const approval = {
          type: APPROVAL_TYPES.operator,
          token_address: address,
          owner,
          operator
        }

        if (authorized) {
          await Approval.create(approval)
        } else {
          await Approval.delete(approval)
        }
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] ${holder} has already set ${operator} as approved for all`
        )
      }
      break
    }
    default:
      break
  }
}

async function reduceEstateRegistry(event) {
  const { name, address } = event

  switch (name) {
    case eventNames.ApprovalForAll: {
      const owner = event.args._owner.toLowerCase()
      const operator = event.args._operator.toLowerCase()
      const approved = event.args._approved === 'true'
      const action = approved ? 'set' : 'remove'

      log.info(`[${name}] ${owner} ${action} ${operator} as approved for all`)

      try {
        const approval = {
          type: APPROVAL_TYPES.operator,
          token_address: address,
          owner,
          operator
        }

        if (_approved) {
          await Approval.create(approval)
        } else {
          await Approval.delete(approval)
        }
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] ${_owner} has already set ${_operator} as approved for all`
        )
      }
      break
    }
    default:
      break
  }
}

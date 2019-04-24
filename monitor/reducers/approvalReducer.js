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
      const approval = {
        type: APPROVAL_TYPES.operator,
        token_address: address,
        owner: event.args.holder.toLowerCase(),
        operator: event.args.operator.toLowerCase()
      }
      const isApproved = event.args.authorized === 'true'

      await handleApproval(event, approval, isApproved)
      break
    }
    case eventNames.UpdateManager: {
      // operator and holder are inverted in the contact
      const approval = {
        type: APPROVAL_TYPES.manager,
        token_address: address,
        owner: event.args._owner.toLowerCase(),
        operator: event.args._operator.toLowerCase()
      }
      const isApproved = event.args._approved === 'true'

      await handleApproval(event, approval, isApproved)
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
      const approval = {
        type: APPROVAL_TYPES.operator,
        token_address: address,
        owner: event.args._owner.toLowerCase(),
        operator: event.args._operator.toLowerCase()
      }
      const isApproved = event.args._approved === 'true'

      await handleApproval(event, approval, isApproved)
      break
    }
    default:
      break
  }
}

async function handleApproval(event, approval, isApproved) {
  const { name } = event
  const { type, owner, operator } = approval
  const action = isApproved ? 'set' : 'remove'

  log.info(`[${name}] ${owner} ${action} ${operator} as ${type}`)

  if (isApproved) {
    try {
      await Approval.insert(approval)
    } catch (error) {
      if (!isDuplicatedConstraintError(error)) throw error
      log.info(`[${name}] ${owner} already set ${operator} as ${type}`)
    }
  } else {
    await Approval.delete(approval)
  }
}

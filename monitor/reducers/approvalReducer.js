import { Log } from 'decentraland-commons'

import { Approval } from '../../src/Approval'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { APPROVAL_TYPES } from '../../shared/approval'

// At block 5808417 the ApprovalForAll event for the LANDRegistry contract kept its signature
// (topic0), but changed its param order:
// Before block 5808417:  ApprovalForAll(operator, owner, authorized)
// After block 5808417: ApprovalForAll(owner, operator, authorized)
// The EstateRegistry is not affected because it was created at block number 6236547.
const APPROVAL_FOR_ALL_ARGS_ORDER_CHANGE_BLOCK_NUMBER = 5808417
const log = new Log('approvalReducer')

export async function approvalReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.LANDRegistry:
    case contractAddresses.EstateRegistry: {
      await reduceRegistries(event)
      break
    }
    default:
      break
  }
}

async function reduceRegistries(event) {
  const { name } = event

  switch (name) {
    case eventNames.ApprovalForAll: {
      await handleApprovalForAll(event)
      break
    }
    case eventNames.UpdateManager: {
      await handleUpdateManager(event)
      break
    }
    default:
      break
  }
}

async function handleApprovalForAll(event) {
  // The props on the rightmost part of the following checks follow the standard
  // To the left, we have our own old implementation of the LANDRegistry
  // and we should add any other non-standard props we find if we add new contracts
  const owner = event.args.holder || event.args._owner
  const operator = event.args.operator || event.args._operator
  const authorization = event.args.authorized || event.args._approved

  const approval = {
    type: APPROVAL_TYPES.operator,
    token_address: event.address,
    owner:
      event.block_number > APPROVAL_FOR_ALL_ARGS_ORDER_CHANGE_BLOCK_NUMBER
        ? owner.toLowerCase()
        : operator.toLowerCase(),
    operator:
      event.block_number > APPROVAL_FOR_ALL_ARGS_ORDER_CHANGE_BLOCK_NUMBER
        ? operator.toLowerCase()
        : owner.toLowerCase()
  }
  const isApproved = authorization === 'true'

  await handleApproval(event, approval, isApproved)
}

async function handleUpdateManager(event) {
  const approval = {
    type: APPROVAL_TYPES.manager,
    token_address: event.address,
    owner: event.args._owner.toLowerCase(),
    operator: event.args._operator.toLowerCase()
  }
  const isApproved = event.args._approved === 'true'

  await handleApproval(event, approval, isApproved)
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

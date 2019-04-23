import { Log } from 'decentraland-commons'

import { Approval } from '../../src/Approval'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'

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
      const holder = event.args.holder.toLowerCase()
      const operator = event.args.operator.toLowerCase()
      const authorized = event.args.authorized === 'true'

      try {
        log.info(
          `[${name}] ${holder} ${
            authorized ? 'set' : 'remove'
          } ${operator} as approved for all`
        )
        if (authorized) {
          await Approval.approveForAll(address, holder, operator)
        } else {
          await Approval.delete({
            token_address: address,
            owner: holder,
            operator
          })
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
      const _owner = event.args._owner.toLowerCase()
      const _operator = event.args._operator.toLowerCase()
      const _approved = event.args._approved === 'true'

      try {
        log.info(
          `[${name}] ${_owner} ${
            _approved ? 'set' : 'remove'
          } ${_operator} as approved for all`
        )
        if (_approved) {
          await Approval.approveForAll(address, _owner, _operator)
        } else {
          await Approval.delete({
            token_address: address,
            owner: _owner,
            operator: _operator
          })
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

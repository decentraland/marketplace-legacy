import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Mortgage } from '../../src/Mortgage'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { isDuplicatedConstraintError } from '../../src/database'
import { MORTGAGE_STATUS } from '../../shared/mortgage'
import { ASSET_TYPE } from '../../shared/asset'
import { getParcelIdFromEvent } from './utils'

const log = new Log('mortgageReducer')

export async function mortgageReducer(event) {
  const { tx_hash, block_number, name } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (name) {
    case BlockchainEvent.EVENTS.newMortgage: {
      const { borrower, loanId, mortgageId } = event.args

      const exists = await Mortgage.count({ tx_hash })
      if (exists) {
        log.info(`[${name}] Mortgage ${tx_hash} already exists`)
        return
      }
      log.info(`[${name}] Creating Mortgage ${mortgageId} for ${parcelId}`)

      const [x, y] = Parcel.splitId(parcelId)
      const LoanIdBN = eth.utils.toBigNumber(loanId)
      const rcnEngineContract = eth.getContract('RCNEngine')

      const [
        amount,
        duesIn,
        expiresAt,
        payableAt,
        outstandingAmount
      ] = await Promise.all([
        rcnEngineContract.getAmount(LoanIdBN),
        rcnEngineContract.getDuesIn(LoanIdBN),
        rcnEngineContract.getExpirationRequest(LoanIdBN),
        rcnEngineContract.getCancelableAt(LoanIdBN),
        rcnEngineContract.sendCall('getPendingAmount', LoanIdBN)
      ])

      const block_time_created_at = await Promise.resolve(
        new BlockTimestampService().getBlockTime(block_number)
      )
      try {
        await Mortgage.insert({
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          status: MORTGAGE_STATUS.ongoing,
          is_due_at: duesIn.toNumber(),
          payable_at: payableAt.toNumber(),
          expires_at: expiresAt.toNumber(),
          mortgage_id: parseInt(mortgageId, 10),
          loan_id: parseInt(loanId, 10),
          block_number,
          block_time_created_at,
          amount: eth.utils.fromWei(amount),
          outstanding_amount: eth.utils.fromWei(outstandingAmount),
          tx_hash,
          asset_id: Parcel.buildId(x, y),
          type: ASSET_TYPE.parcel,
          borrower
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Mortgage of hash ${tx_hash} already exists and it's not open`
        )
      }
      break
    }
    case BlockchainEvent.EVENTS.cancelledMortgage: {
      const { _id } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      try {
        log.info(`[${name}] Cancelling Mortgage ${_id}`)
        await Mortgage.update(
          {
            status: MORTGAGE_STATUS.cancelled,
            block_time_updated_at
          },
          { mortgage_id: _id }
        )
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Mortgage of hash ${tx_hash} already exists and it's not open`
        )
      }
      break
    }
    case BlockchainEvent.EVENTS.startedMortgage: {
      const { _id } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      try {
        log.info(`[${name}] Starting Mortgage ${_id}`)
        await Mortgage.update(
          {
            status: MORTGAGE_STATUS.ongoing,
            block_time_updated_at
          },
          { mortgage_id: _id }
        )
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Mortgage of hash ${tx_hash} already exists and it's not open`
        )
      }
      break
    }
    case BlockchainEvent.EVENTS.partialPayment: {
      const { _index } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      log.info(`[${name}] Partial Payment for loan ${_index}`)

      const rcnEngineContract = eth.getContract('RCNEngine')
      const outstandingAmount = await rcnEngineContract.sendCall(
        'getPendingAmount',
        eth.utils.toBigNumber(_index)
      )

      await Mortgage.update(
        {
          outstanding_amount: eth.utils.fromWei(outstandingAmount),
          block_time_updated_at
        },
        { loan_id: _index }
      )
      break
    }
    case BlockchainEvent.EVENTS.totalPayment: {
      const { _index } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      log.info(`[${name}] Total Payment Mortgage for loan ${_index}`)
      await Mortgage.update(
        {
          status: MORTGAGE_STATUS.paid,
          outstanding_amount: 0,
          block_time_updated_at
        },
        { loan_id: _index }
      )
      break
    }
    case BlockchainEvent.EVENTS.paidMortgage: {
      const { _id } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      log.info(`[${name}] Claimed Mortgage ${_id}`)
      await Mortgage.update(
        {
          status: MORTGAGE_STATUS.claimed,
          block_time_updated_at
        },
        { mortgage_id: _id }
      )
      break
    }
    case BlockchainEvent.EVENTS.defaultedMortgage: {
      const { _id } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      log.info(`[${name}] Defaulted Mortgage ${_id}`)
      await Mortgage.update(
        {
          status: MORTGAGE_STATUS.defaulted,
          block_time_updated_at
        },
        { mortgage_id: _id }
      )
      break
    }
    default:
      break
  }
}

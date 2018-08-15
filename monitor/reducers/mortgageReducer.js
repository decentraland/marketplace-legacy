import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Mortgage } from '../../src/Mortgage'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { isDuplicatedConstraintError } from '../../src/database'
import { MORTGAGE_STATUS } from '../../shared/mortgage'
import { ASSET_TYPE } from '../../shared/asset'
import { getParcelIdFromEvent } from './utils'

const log = new Log('mortgageReducer')

export async function mortgageReducer(events, event) {
  const { tx_hash, block_number, name, normalizedName } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (normalizedName) {
    case events.newMortgage: {
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
        expiresAt,
        payableAt,
        interestRate,
        punitoryInterestRate
      ] = await Promise.all([
        rcnEngineContract.getAmount(LoanIdBN),
        rcnEngineContract.getExpirationRequest(LoanIdBN),
        rcnEngineContract.getCancelableAt(LoanIdBN),
        rcnEngineContract.getInterestRate(LoanIdBN),
        rcnEngineContract.getInterestRatePunitory(LoanIdBN)
      ])

      const block_time_created_at = await Promise.resolve(
        new BlockTimestampService().getBlockTime(block_number)
      )
      try {
        await Mortgage.insert({
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          status: MORTGAGE_STATUS.pending,
          interest_rate: interestRate.toNumber(),
          punitory_interest_rate: punitoryInterestRate.toNumber(),
          is_due_at: 0,
          payable_at: payableAt.toNumber(),
          expires_at: expiresAt.toNumber(),
          mortgage_id: parseInt(mortgageId, 10),
          loan_id: parseInt(loanId, 10),
          block_number,
          block_time_created_at,
          amount: eth.utils.fromWei(amount),
          outstanding_amount: 0,
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
    case events.cancelledMortgage: {
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
    case events.startedMortgage: {
      const { _id } = event.args

      try {
        log.info(`[${name}] Starting Mortgage ${_id}`)
        const mortgage = (await Mortgage.findByMortgageId(_id))[0]
        if (!mortgage) return

        const rcnEngineContract = eth.getContract('RCNEngine')
        const loanIdBN = eth.utils.toBigNumber(mortgage.loan_id)

        const [
          block_time_updated_at,
          outstandingAmount,
          dueTime
        ] = await Promise.all([
          new BlockTimestampService().getBlockTime(block_number),
          rcnEngineContract.sendCall('getPendingAmount', loanIdBN),
          rcnEngineContract.getDueTime(loanIdBN)
        ])

        await Mortgage.update(
          {
            status: MORTGAGE_STATUS.ongoing,
            outstanding_amount: eth.utils.fromWei(outstandingAmount),
            block_time_updated_at,
            started_at: block_time_updated_at,
            is_due_at: dueTime.toNumber()
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
    case events.partialPayment: {
      const { _index } = event.args
      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      log.info(`[${name}] Partial Payment for loan ${_index}`)

      const rcnEngineContract = eth.getContract('RCNEngine')
      const [outstandingAmount, paid] = await Promise.all([
        rcnEngineContract.sendCall(
          'getPendingAmount',
          eth.utils.toBigNumber(_index)
        ),
        rcnEngineContract.getPaid(eth.utils.toBigNumber(_index))
      ])

      await Mortgage.update(
        {
          outstanding_amount: eth.utils.fromWei(outstandingAmount),
          paid: eth.utils.fromWei(paid),
          block_time_updated_at
        },
        { loan_id: _index }
      )
      break
    }
    case events.totalPayment: {
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
    case events.paidMortgage: {
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
    case events.defaultedMortgage: {
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

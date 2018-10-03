import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Mortgage } from '../../src/Mortgage'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { MORTGAGE_STATUS } from '../../shared/mortgage'
import { ASSET_TYPES } from '../../shared/asset'
import { getParcelIdFromEvent } from './utils'

const log = new Log('mortgageReducer')
const TEN_YEARS_IN_MILISECONDS = 1000 * 10 * 365 * 24 * 60 * 60

export async function mortgageReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.MortgageHelper: {
      await reduceMortgageHelper(event)
      break
    }
    case contractAddresses.MortgageManager: {
      await reduceMortgageManager(event)
      break
    }
    case contractAddresses.RCNEngine: {
      await reduceRCNEngine(event)
      break
    }
    default:
      break
  }
}

async function reduceMortgageHelper(event) {
  const { tx_hash, block_number, name } = event

  const parcelId = await getParcelIdFromEvent(event)
  if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)

  switch (name) {
    case eventNames.NewMortgage: {
      const { borrower, loanId, mortgageId } = event.args

      const exists = await Mortgage.count({ tx_hash })
      if (exists) {
        return log.info(`[${name}] Mortgage ${tx_hash} already exists`)
      }
      log.info(`[${name}] Creating Mortgage ${mortgageId} for ${parcelId}`)

      const LoanIdBN = eth.utils.toBigNumber(loanId)
      const rcnEngineContract = eth.getContract('RCNEngine')

      const [
        amount,
        expiresAt,
        payableAt,
        interestRate,
        punitoryInterestRate,
        blockTime
      ] = await Promise.all([
        rcnEngineContract.getAmount(LoanIdBN),
        rcnEngineContract.getExpirationRequest(LoanIdBN),
        rcnEngineContract.getCancelableAt(LoanIdBN),
        rcnEngineContract.getInterestRate(LoanIdBN),
        rcnEngineContract.getInterestRatePunitory(LoanIdBN),
        new BlockTimestampService().getBlockTime(block_number)
      ])

      try {
        await Mortgage.insert({
          tx_status: txUtils.TRANSACTION_TYPES.confirmed,
          status: MORTGAGE_STATUS.pending,
          interest_rate: interestRate.toNumber(),
          punitory_interest_rate: punitoryInterestRate.toNumber(),
          is_due_at: 0,
          payable_at: payableAt.toNumber(),
          expires_at: Math.min(
            expiresAt.toNumber(),
            Date.now() + TEN_YEARS_IN_MILISECONDS
          ),
          mortgage_id: parseInt(mortgageId, 10),
          loan_id: parseInt(loanId, 10),
          amount: eth.utils.fromWei(amount),
          outstanding_amount: 0,
          asset_id: parcelId,
          asset_type: ASSET_TYPES.parcel,
          block_time_created_at: blockTime,
          block_number,
          tx_hash,
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
    default:
      break
  }
}

async function reduceMortgageManager(event) {
  const { tx_hash, block_number, name } = event

  const blockTime = await new BlockTimestampService().getBlockTime(block_number)

  switch (name) {
    case eventNames.CancelledMortgage: {
      const { _id } = event.args
      try {
        log.info(`[${name}] Cancelling Mortgage ${_id}`)
        await Mortgage.update(
          {
            status: MORTGAGE_STATUS.cancelled,
            block_time_updated_at: blockTime
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
    case eventNames.StartedMortgage: {
      const { _id } = event.args

      try {
        log.info(`[${name}] Starting Mortgage ${_id}`)
        const mortgage = (await Mortgage.findByMortgageId(_id))[0]
        if (!mortgage) return

        const rcnEngineContract = eth.getContract('RCNEngine')
        const loanIdBN = eth.utils.toBigNumber(mortgage.loan_id)

        const [outstandingAmount, dueTime] = await Promise.all([
          rcnEngineContract.sendCall('getPendingAmount', loanIdBN),
          rcnEngineContract.getDueTime(loanIdBN)
        ])

        await Mortgage.update(
          {
            status: MORTGAGE_STATUS.ongoing,
            outstanding_amount: eth.utils.fromWei(outstandingAmount),
            block_time_updated_at: blockTime,
            started_at: blockTime,
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
    case eventNames.PaidMortgage: {
      const { _id } = event.args

      log.info(`[${name}] Claimed Mortgage ${_id}`)
      await Mortgage.update(
        { status: MORTGAGE_STATUS.claimed, block_time_updated_at: blockTime },
        { mortgage_id: _id }
      )
      break
    }
    case eventNames.DefaultedMortgage: {
      const { _id } = event.args

      log.info(`[${name}] Defaulted Mortgage ${_id}`)
      await Mortgage.update(
        { status: MORTGAGE_STATUS.defaulted, block_time_updated_at: blockTime },
        { mortgage_id: _id }
      )
      break
    }
    default:
      break
  }
}

async function reduceRCNEngine(event) {
  const { block_number, name } = event

  const blockTime = await new BlockTimestampService().getBlockTime(block_number)

  switch (name) {
    case eventNames.PartialPayment: {
      const { _index } = event.args

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
          block_time_updated_at: blockTime
        },
        { loan_id: _index }
      )
      break
    }
    case eventNames.TotalPayment: {
      const { _index } = event.args

      log.info(`[${name}] Total Payment Mortgage for loan ${_index}`)
      await Mortgage.update(
        {
          status: MORTGAGE_STATUS.paid,
          outstanding_amount: 0,
          block_time_updated_at: blockTime
        },
        { loan_id: _index }
      )
      break
    }
    default:
      break
  }
}

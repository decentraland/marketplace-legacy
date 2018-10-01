import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { db } from '../database'
import { Mortgage } from '../Mortgage'
import { Parcel } from '../Asset'
import { Publication } from '../Publication'
import { ASSET_TYPES } from '../shared/asset'
import { MORTGAGE_STATUS } from '../shared/mortgage'

describe('Mortgage', function() {
  const expires_at = new Date().getTime() * 1000
  const is_due_at = 15000
  const payable_at = 1000
  let mortgage = {}

  beforeEach(() => {
    mortgage = {
      tx_hash: '1xdeadbeef',
      tx_status: txUtils.TRANSACTION_TYPES.confirmed,
      status: MORTGAGE_STATUS.pending,
      loan_id: 0,
      mortgage_id: 0,
      asset_id: Parcel.buildId(2, 5),
      asset_type: ASSET_TYPES.parcel,
      borrower: '0xdeadbeef33',
      lender: null,
      amount: 1500,
      block_time_created_at: null,
      block_time_updated_at: null,
      interest_rate: 0,
      punitory_interest_rate: 0,
      paid: 0,
      started_at: null,
      outstanding_amount: 1500,
      block_number: 1,
      is_due_at,
      payable_at,
      expires_at
    }
  })
  afterEach(() =>
    Promise.all(
      [Mortgage, Publication].map(Model => db.truncate(Model.tableName))
    ))

  describe('.findByBorrower', async () => {
    it('should get actives mortgages by borrower', async () => {
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '2xdeadbeff',
        loan_id: 2,
        mortgage_id: 2,
        borrower: '0xdeadbeef34'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(5, 5),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.cancelled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])
      const mortgages = await Mortgage.findByBorrower('0xdeadbeef33', [
        MORTGAGE_STATUS.pending,
        MORTGAGE_STATUS.ongoing
      ])
      expect(mortgages).to.equalRows([
        {
          ...mortgage4,
          payable_at: String(payable_at),
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        },
        {
          ...mortgage,
          payable_at: String(payable_at),
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        }
      ])
    })

    it('should return empty array if there are not mortgages to retrieve', async () => {
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '2xdeadbeff',
        loan_id: 2,
        mortgage_id: 2,
        borrower: '0xdeadbeef34'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(5, 5),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.cancelled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])
      const mortgages = await Mortgage.findByBorrower('0xdeadbeef33122', [
        MORTGAGE_STATUS.pending,
        MORTGAGE_STATUS.ongoing
      ])
      expect(mortgages).to.equalRows([])
    })
  })

  describe('.findInCoordinate', async () => {
    it('should get actives mortgages by coordinate', async () => {
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(10, 10),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(10, 10),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeefab'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3)
      ])
      const mortgages = await Mortgage.findInCoordinate(
        Parcel.buildId(10, 10),
        [MORTGAGE_STATUS.pending, MORTGAGE_STATUS.ongoing]
      )

      expect(mortgages).to.equalRows([
        {
          ...mortgage3,
          payable_at: String(payable_at),
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        },
        {
          ...mortgage2,
          payable_at: String(payable_at),
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        }
      ])
    })

    it('should return empty array if there are not mortgages to retrieve', async () => {
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '2xdeadbeff',
        loan_id: 2,
        mortgage_id: 2,
        borrower: '0xdeadbeef34'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(5, 5),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.cancelled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])
      const mortgages = await Mortgage.findInCoordinate(
        Parcel.buildId(20, 20),
        [MORTGAGE_STATUS.pending, MORTGAGE_STATUS.ongoing]
      )
      expect(mortgages).to.equalRows([])
    })
  })
})

import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { db } from '../database'
import { Mortgage } from '../Mortgage'
import { Parcel } from '../Parcel'
import { ASSET_TYPE } from '../Asset'
import { Publication } from '../Publication'

describe('Mortgage', function() {
  const expires_at = new Date().getTime() * 1000
  const is_due_at = 15000
  const payable_at = 1000
  let mortgage = {}

  beforeEach(async () => {
    mortgage = {
      tx_hash: '1xdeadbeef',
      tx_status: txUtils.TRANSACTION_STATUS.confirmed,
      status: Mortgage.STATUS.pending,
      loan_id: 0,
      mortgage_id: 0,
      asset_id: Parcel.buildId(2, 5),
      type: ASSET_TYPE.parcel, // TODO: change with constant
      borrower: '0xdeadbeef33',
      lender: null,
      amount: 1500,
      block_time_created_at: null,
      block_time_updated_at: null,
      started_at: null,
      amount_paid: 0,
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
        status: Mortgage.STATUS.canceled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: Mortgage.STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])
      const mortgages = await Mortgage.findByBorrower(
        '0xdeadbeef33',
        `${Mortgage.STATUS.pending},${Mortgage.STATUS.ongoing}`
      )
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
        status: Mortgage.STATUS.canceled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: Mortgage.STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3),
        Mortgage.insert(mortgage4)
      ])
      const mortgages = await Mortgage.findByBorrower(
        '0xdeadbeef33122',
        `${Mortgage.STATUS.pending},${Mortgage.STATUS.ongoing}`
      )
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
        status: Mortgage.STATUS.ongoing,
        borrower: '0xdeadbeef33'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(10, 10),
        loan_id: 4,
        mortgage_id: 4,
        status: Mortgage.STATUS.ongoing,
        borrower: '0xdeadbeefab'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3)
      ])
      const mortgages = await Mortgage.findInCoordinate(
        Parcel.buildId(10, 10),
        `${Mortgage.STATUS.pending},${Mortgage.STATUS.ongoing}`
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
        status: Mortgage.STATUS.canceled,
        borrower: '0xdeadbeef33'
      })
      const mortgage4 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(6, 5),
        loan_id: 4,
        mortgage_id: 4,
        status: Mortgage.STATUS.ongoing,
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
        `${Mortgage.STATUS.pending},${Mortgage.STATUS.ongoing}`
      )
      expect(mortgages).to.equalRows([])
    })
  })
})

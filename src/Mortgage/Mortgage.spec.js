import { expect } from 'chai'
import { txUtils } from 'decentraland-eth'

import { db } from '../database'
import { Mortgage } from '../Mortgage'
import { Parcel } from '../Parcel'
import { MORTGAGE_STATUS } from '../shared/mortgage'

describe('Mortgage', function() {
  afterEach(() =>
    Promise.all([Mortgage].map(Model => db.truncate(Model.tableName))))

  describe('.findByBorrower', async () => {
    it('should get actives mortgages by borrower', async () => {
      const expires_at = new Date().getTime() * 1000
      const is_due_at = new Date().getTime() * 1000
      const mortgage = {
        tx_hash: '1xdeadbeef',
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: MORTGAGE_STATUS.open,
        loan_id: 0,
        mortgage_id: 0,
        asset_id: Parcel.buildId(2, 5),
        type: 'parcel', // TODO: change with constant
        borrower: '0xdeadbeef33',
        lender: null,
        amount: 1500,
        block_time_created_at: null,
        block_time_updated_at: null,
        block_number: 1,
        is_due_at,
        expires_at
      }
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
        status: MORTGAGE_STATUS.claimed,
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
        `${MORTGAGE_STATUS.open},${MORTGAGE_STATUS.claimed}`
      )
      expect(mortgages).to.equalRows([
        {
          ...mortgage4,
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        },
        {
          ...mortgage,
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        }
      ])
    })

    it('should return empty array if there are not mortgages to retrieve', async () => {
      const mortgage = {
        tx_hash: '1xdeadbeef',
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: MORTGAGE_STATUS.open,
        loan_id: 0,
        mortgage_id: 0,
        asset_id: Parcel.buildId(2, 5),
        type: 'parcel', // TODO: change with constant
        borrower: '0xdeadbeef33',
        lender: null,
        is_due_at: new Date().getTime() * 1000,
        amount: 1500,
        expires_at: new Date().getTime() * 1000,
        block_time_created_at: null,
        block_time_updated_at: null,
        block_number: 1
      }
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
        status: MORTGAGE_STATUS.claimed,
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
        `${MORTGAGE_STATUS.open},${MORTGAGE_STATUS.claimed}`
      )
      expect(mortgages).to.equalRows([])
    })
  })

  describe('.findInCoordinate', async () => {
    it('should get actives mortgages by coordinate', async () => {
      const expires_at = new Date().getTime() * 1000
      const is_due_at = new Date().getTime() * 1000
      const mortgage = {
        tx_hash: '1xdeadbeef',
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: MORTGAGE_STATUS.open,
        loan_id: 0,
        mortgage_id: 0,
        asset_id: Parcel.buildId(10, 10),
        type: 'parcel', // TODO: change with constant
        borrower: '0xdeadbeefaa',
        lender: null,
        amount: 1500,
        block_time_created_at: null,
        block_time_updated_at: null,
        block_number: 1,
        is_due_at,
        expires_at
      }
      const mortgage2 = Object.assign({}, mortgage, {
        tx_hash: '3xdeadbdff',
        asset_id: Parcel.buildId(10, 10),
        loan_id: 3,
        mortgage_id: 3,
        status: MORTGAGE_STATUS.claimed,
        borrower: '0xdeadbeefab'
      })
      const mortgage3 = Object.assign({}, mortgage, {
        tx_hash: '4xdeadbeff',
        asset_id: Parcel.buildId(11, 11),
        loan_id: 4,
        mortgage_id: 4,
        status: MORTGAGE_STATUS.claimed,
        borrower: '0xdeadbeef33'
      })
      await Promise.all([
        Mortgage.insert(mortgage),
        Mortgage.insert(mortgage2),
        Mortgage.insert(mortgage3)
      ])
      const mortgages = await Mortgage.findInCoordinate(
        Parcel.buildId(10, 10),
        `${MORTGAGE_STATUS.open},${MORTGAGE_STATUS.claimed}`
      )
      expect(mortgages).to.equalRows([
        {
          ...mortgage2,
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        },
        {
          ...mortgage,
          is_due_at: String(is_due_at),
          expires_at: String(expires_at)
        }
      ])
    })

    it('should return empty array if there are not mortgages to retrieve', async () => {
      const mortgage = {
        tx_hash: '1xdeadbeef',
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: MORTGAGE_STATUS.open,
        loan_id: 0,
        mortgage_id: 0,
        asset_id: Parcel.buildId(2, 5),
        type: 'parcel', // TODO: change with constant
        borrower: '0xdeadbeef33',
        lender: null,
        is_due_at: new Date().getTime() * 1000,
        amount: 1500,
        expires_at: new Date().getTime() * 1000,
        block_time_created_at: null,
        block_time_updated_at: null,
        block_number: 1
      }
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
        status: MORTGAGE_STATUS.claimed,
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
        `${MORTGAGE_STATUS.open},${MORTGAGE_STATUS.claimed}`
      )
      expect(mortgages).to.equalRows([])
    })
  })
})

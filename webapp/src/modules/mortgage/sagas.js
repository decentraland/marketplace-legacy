import { takeLatest, call, put, select, all } from 'redux-saga/effects'
import { eth } from 'decentraland-eth'
import { push } from 'react-router-redux'
import { api } from 'lib/api'
import { MORTGAGE_STATUS } from './utils'

import {
  CREATE_MORTGAGE_REQUEST,
  CANCEL_MORTGAGE_REQUEST,
  FETCH_MORTGAGED_PARCELS_REQUEST,
  FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
  createMortgageSuccess,
  createMortgageFailure,
  cancelMortgageFailure,
  cancelMortgageSuccess,
  fetchMortgagedParcelsSuccess,
  fetchMortgagedParcelsFailure,
  fetchActiveParcelMortgagesSuccess,
  fetchActiveParcelMortgagesFailure
} from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { toInterestRate, getLoanMetadata, daysToSeconds } from './utils'
import { getKyberOracleAddress } from 'modules/wallet/utils'
import { locations } from 'locations'

export function* mortgageSaga() {
  yield takeLatest(CREATE_MORTGAGE_REQUEST, handleCreateMortgageRequest)
  yield takeLatest(CANCEL_MORTGAGE_REQUEST, handleCancelMortgageRequest)
  yield takeLatest(FETCH_MORTGAGED_PARCELS_REQUEST, handleFetchMortgageRequest)
  yield takeLatest(
    FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
    handleFetchActiveParcelMortgagesRequest
  )
}

function* handleFetchMortgageRequest(action) {
  try {
    const { borrower } = action
    const [parcels, mortgages] = yield all([
      call(() => api.fetchMortgagedParcels(borrower)),
      call(() =>
        api.fetchMortgagesByBorrower(borrower, [
          MORTGAGE_STATUS.pending,
          MORTGAGE_STATUS.ongoing
        ])
      )
    ])
    yield put(fetchMortgagedParcelsSuccess(parcels, mortgages))
  } catch (error) {
    yield put(fetchMortgagedParcelsFailure(error.message))
  }
}

function* handleCreateMortgageRequest(action) {
  try {
    let {
      duration,
      payableAt,
      expiresAt,
      interestRate,
      punitoryRate,
      parcel,
      amount
    } = action

    const rcnEngineContract = eth.getContract('RCNEngine')
    const mortgageCreatorContract = eth.getContract('MortgageCreator')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const kyberOrcaleAddress = getKyberOracleAddress()
    const manaCurrency = eth.utils.fromAscii('MANA')

    const landId = yield call(() =>
      landRegistryContract.encodeTokenId(parcel.x, parcel.y)
    )
    const borrower = yield select(getAddress)
    const loanMetadata = getLoanMetadata()

    let loanParams = [
      eth.utils.toWei(amount), // Amount requested
      toInterestRate(interestRate), // Anual interest
      toInterestRate(punitoryRate), // Anual punnitory interest
      daysToSeconds(duration), // Duration of the loan, in seconds
      daysToSeconds(payableAt), // Time when the payment of the loan starts
      expiresAt // Expiration timestamp of the request
    ]

    // Retrieve the loan signature
    let loanIdentifier = yield call(() =>
      rcnEngineContract.buildIdentifier(
        kyberOrcaleAddress, // Contract of the oracle
        borrower, // Borrower of the loan (caller of this method)
        mortgageCreatorContract.address, // Creator of the loan, the mortgage creator
        manaCurrency, // Currency of the loan, MANA
        ...loanParams,
        loanMetadata // Metadata
      )
    )

    // Sign the loan
    let { signature } = yield call(() => eth.sign(loanIdentifier))
    const approveSignature = signature.slice(2)
    let r = `0x${approveSignature.slice(0, 64)}`
    let s = `0x${approveSignature.slice(64, 128)}`
    let v = eth.utils.toDecimal(`0x${approveSignature.slice(128, 130)}`)

    // Request a Mortgage
    let mortgageReceipt = yield call(() =>
      mortgageCreatorContract.requestMortgage(
        loanParams, // Configuration of the loan request
        loanMetadata, // Metadata of the loan
        landId, // Id of the loan to buy
        v, // Signature of the loan
        r, // Signature of the loan
        s // Signature of the loan
      )
    )

    yield put(createMortgageSuccess(mortgageReceipt, parcel))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(createMortgageFailure(error.message))
  }
}

function* handleCancelMortgageRequest(action) {
  try {
    const { mortgageId, assetId } = action
    const mortgageManagerContract = eth.getContract('MortgageManager')

    const mortgageCancelReceipt = yield call(() =>
      mortgageManagerContract.cancelMortgage(mortgageId)
    )

    yield put(cancelMortgageSuccess(mortgageCancelReceipt, assetId))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(cancelMortgageFailure(error.message))
  }
}

function* handleFetchActiveParcelMortgagesRequest(action) {
  try {
    const { x, y } = action
    const mortgages = yield call(() =>
      api.fetchMortgages(x, y, [
        MORTGAGE_STATUS.pending,
        MORTGAGE_STATUS.ongoing
      ])
    )
    yield put(fetchActiveParcelMortgagesSuccess(mortgages, x, y))
  } catch (error) {
    yield put(fetchActiveParcelMortgagesFailure(error.message))
  }
}

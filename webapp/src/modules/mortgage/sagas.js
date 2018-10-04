import { takeLatest, call, put, select, all } from 'redux-saga/effects'
import { eth } from 'decentraland-eth'
import { push } from 'react-router-redux'
import { isFeatureEnabled } from 'lib/featureUtils'
import { api } from 'lib/api'
import {
  CREATE_MORTGAGE_REQUEST,
  CANCEL_MORTGAGE_REQUEST,
  FETCH_MORTGAGED_PARCELS_REQUEST,
  FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
  PAY_MORTGAGE_REQUEST,
  CLAIM_MORTGAGE_RESOLUTION_REQUEST,
  createMortgageSuccess,
  createMortgageFailure,
  cancelMortgageFailure,
  cancelMortgageSuccess,
  fetchMortgagedParcelsSuccess,
  fetchMortgagedParcelsFailure,
  fetchActiveParcelMortgagesSuccess,
  fetchActiveParcelMortgagesFailure,
  payMortgageSuccess,
  payMortgageFailure,
  claimMortgageResolutionSuccess,
  claimMortgageResolutionFailure,
  fetchActiveParcelMortgagesRequest
} from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { normalizeParcel } from 'shared/parcel'

import {
  MORTGAGE_STATUS,
  toInterestRate,
  getLoanMetadata,
  daysToSeconds
} from 'shared/mortgage'
import { getKyberOracleAddress, getContractAddress } from 'modules/wallet/utils'
import { locations } from 'locations'
import { FETCH_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { getAssetPublications } from 'shared/asset'

export function* mortgageSaga() {
  if (isFeatureEnabled('MORTGAGES')) {
    yield takeLatest(CREATE_MORTGAGE_REQUEST, handleCreateMortgageRequest)
    yield takeLatest(CANCEL_MORTGAGE_REQUEST, handleCancelMortgageRequest)
    yield takeLatest(
      FETCH_MORTGAGED_PARCELS_REQUEST,
      handleFetchMortgageRequest
    )
    yield takeLatest(PAY_MORTGAGE_REQUEST, handlePayMortgageRequest)
    yield takeLatest(
      FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
      handleFetchActiveParcelMortgagesRequest
    )
    yield takeLatest(
      CLAIM_MORTGAGE_RESOLUTION_REQUEST,
      handleClaimMortgageResolutionRequest
    )
    yield takeLatest(FETCH_PARCEL_SUCCESS, handleFetchParcelSuccess)
  }
}

function* handleFetchMortgageRequest(action) {
  try {
    const { borrower } = action
    const [parcels, mortgages] = yield all([
      call(() => api.fetchMortgagedParcels(borrower)),
      call(() =>
        api.fetchMortgagesByBorrower(borrower, [
          MORTGAGE_STATUS.pending,
          MORTGAGE_STATUS.ongoing,
          MORTGAGE_STATUS.paid
        ])
      )
    ])

    yield put(
      fetchMortgagedParcelsSuccess(
        parcels.map(normalizeParcel),
        mortgages,
        getAssetPublications(parcels)
      )
    )
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
    const mortgageHelperContract = eth.getContract('MortgageHelper')
    const landRegistryContract = eth.getContract('LANDRegistry')
    const kyberOrcaleAddress = getKyberOracleAddress()
    const manaCurrency = eth.utils.fromAscii('MANA')

    const landId = yield call(() =>
      landRegistryContract.encodeTokenId(parcel.x, parcel.y)
    )
    const borrower = yield select(getAddress)
    const loanMetadata = getLoanMetadata(getContractAddress('MortgageManager'))

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
        mortgageHelperContract.address, // Creator of the loan, the mortgage helper
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
      mortgageHelperContract.requestMortgage(
        loanParams, // Configuration of the loan request
        loanMetadata, // Metadata of the loan
        landId, // Id of the loan to buy
        v, // Signature of the loan
        r, // Signature of the loan
        s // Signature of the loan
      )
    )

    yield put(createMortgageSuccess(mortgageReceipt, parcel))
    yield put(push(locations.activity()))
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
    yield put(push(locations.activity()))
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
        MORTGAGE_STATUS.ongoing,
        MORTGAGE_STATUS.paid
      ])
    )
    yield put(fetchActiveParcelMortgagesSuccess(mortgages, x, y))
  } catch (error) {
    yield put(fetchActiveParcelMortgagesFailure(error.message))
  }
}

function* handlePayMortgageRequest(action) {
  try {
    const { loanId, amount, assetId } = action
    const mortgageHelperContract = eth.getContract('MortgageHelper')
    const rcnEngineAddress = getContractAddress('RCNEngine')

    const payMortgageReceipt = yield call(() =>
      mortgageHelperContract.pay(
        rcnEngineAddress,
        loanId,
        eth.utils.toWei(amount),
        { gasPrice: eth.utils.toWei(4, 'gwei') }
      )
    )

    yield put(payMortgageSuccess(payMortgageReceipt, assetId, amount))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(payMortgageFailure(error.message))
  }
}

function* handleClaimMortgageResolutionRequest(action) {
  try {
    const { loanId, assetId } = action
    const mortgageManagerContract = eth.getContract('MortgageManager')
    const rcnEngineAddress = getContractAddress('RCNEngine')

    const claimMortgageResolutionReceipt = yield call(() =>
      mortgageManagerContract.claim(rcnEngineAddress, loanId, [])
    )

    yield put(
      claimMortgageResolutionSuccess(claimMortgageResolutionReceipt, assetId)
    )
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(claimMortgageResolutionFailure(error.message))
  }
}

function* handleFetchParcelSuccess(action) {
  yield put(fetchActiveParcelMortgagesRequest(action.x, action.y))
}

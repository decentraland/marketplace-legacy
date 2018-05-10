import { takeLatest, call, put, select } from 'redux-saga/effects'
import { eth } from 'decentraland-eth'
import { push } from 'react-router-redux'

import {
  CREATE_MORTGAGE_REQUEST,
  createMortgageSuccess,
  createMortgageFailure
} from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { toInterestRate, getLoanMetadata } from './utils'
import { getKyberOracleAddress } from 'modules/wallet/utils'
import { locations } from 'locations'

export function* mortgageSaga() {
  yield takeLatest(CREATE_MORTGAGE_REQUEST, handleCreateMortgageRequest)
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
      amount, // Amount requested
      toInterestRate(interestRate), // Anual interest
      toInterestRate(punitoryRate), // Anual punnitory interest
      duration, // Duration of the loan, in seconds
      payableAt, // Time when the payment of the loan starts
      expiresAt // Expiration timestamp of the request
    ]

    console.log(
      duration, // Duration of the loan, in seconds
      payableAt, // Time when the payment of the loan starts
      expiresAt // Expiration timestamp of the request
    )
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

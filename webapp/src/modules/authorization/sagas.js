import { eth } from 'decentraland-eth'
import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { getPathname } from '@dapps/modules/location/selectors'

import { locations } from 'locations'
import { getParams } from 'modules/auction/selectors'

import {
  FETCH_AUTHORIZATION_REQUEST,
  ALLOW_TOKEN_REQUEST,
  APPROVE_TOKEN_REQUEST,
  fetchAuthorizationSuccess,
  fetchAuthorizationFailure,
  allowTokenSuccess,
  allowTokenFailure,
  approveTokenSuccess,
  approveTokenFailure
} from './actions'

export function* authorizationSaga() {
  yield takeEvery(FETCH_AUTHORIZATION_REQUEST, handleFetchAuthorizationRequest)
  yield takeEvery(ALLOW_TOKEN_REQUEST, handleAllowTokenRequest)
  yield takeEvery(APPROVE_TOKEN_REQUEST, handleApproveTokenRequest)
}

function* handleFetchAuthorizationRequest(action = {}) {
  try {
    const payload = action.payload
    const address = payload.address.toLowerCase()

    const [allowances, approvals] = yield all([
      fillAuthorization(payload.allowances, (tokenContract, contract) =>
        tokenContract.allowance(address, contract.address)
      ),
      fillAuthorization(payload.approvals, (tokenContract, contract) =>
        tokenContract.isApprovedForAll(address, contract.address)
      )
    ])

    const authorization = { allowances, approvals }

    yield put(fetchAuthorizationSuccess(address, authorization))
  } catch (error) {
    yield put(fetchAuthorizationFailure(error.message))
  }
}

function* fillAuthorization(contractsToReview, contractCall) {
  const authorization = {}

  for (const contractName in contractsToReview) {
    const contract = eth.getContract(contractName)
    const tokenContractNames = contractsToReview[contractName]

    for (const tokenContractName of tokenContractNames) {
      let result = yield call(() =>
        contractCall(eth.getContract(tokenContractName), contract)
      )
      result =
        typeof result.toNumber === 'function' ? result.toNumber() : result // handle BigNumbers

      authorization[contractName] = {
        ...authorization[contractName],
        [tokenContractName]: result
      }
    }
  }

  return authorization
}

function* handleAllowTokenRequest(action) {
  try {
    const {
      amount,
      contractName,
      tokenContractName = 'MANAToken'
    } = action.payload
    const address = yield call(() => eth.getAddress())

    const contractToApprove = eth.getContract(contractName)
    const tokenContract = eth.getContract(tokenContractName)

    // AUCTION
    let options
    const pathname = yield select(getPathname)
    if (pathname === locations.auction()) {
      const { gasPriceLimit } = yield select(getParams)
      const gasPrice = gasPriceLimit * 1000000000
      options = { gasPrice }
    }

    const txHash = yield call(() =>
      tokenContract.approve(contractToApprove.address, amount, options)
    )

    yield put(
      allowTokenSuccess(
        txHash,
        address,
        amount,
        contractName,
        tokenContractName
      )
    )
  } catch (error) {
    yield put(allowTokenFailure(error.message))
  }
}

function* handleApproveTokenRequest(action) {
  try {
    const {
      isApproved,
      contractName,
      tokenContractName = 'LANDRegistry'
    } = action.payload
    const address = yield call(() => eth.getAddress())

    const contractToApprove = eth.getContract(contractName)
    const tokenContract = eth.getContract(tokenContractName)

    const txHash = yield call(() =>
      tokenContract.setApprovalForAll(contractToApprove.address, isApproved)
    )

    yield put(
      approveTokenSuccess(
        txHash,
        address,
        isApproved,
        contractName,
        tokenContractName
      )
    )
  } catch (error) {
    yield put(approveTokenFailure(error.message))
  }
}

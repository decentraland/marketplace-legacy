import { eth } from 'decentraland-eth'
import { all, put, call, takeEvery } from 'redux-saga/effects'

import {
  FETCH_AUTHORIZATIONS_REQUEST,
  ALLOW_TOKEN_REQUEST,
  APPROVE_TOKEN_REQUEST,
  fetchAuthorizationsSuccess,
  fetchAuthorizationsFailure,
  allowTokenSuccess,
  allowTokenFailure,
  approveTokenSuccess,
  approveTokenFailure
} from './actions'

export function* authorizationSaga() {
  yield takeEvery(
    FETCH_AUTHORIZATIONS_REQUEST,
    handleFetchAuthorizationsRequest
  )
  yield takeEvery(ALLOW_TOKEN_REQUEST, handleAllowTokenRequest)
  yield takeEvery(APPROVE_TOKEN_REQUEST, handleApproveTokenRequest)
}

function* handleFetchAuthorizationsRequest(action = {}) {
  try {
    const payload = action.payload
    const address = payload.address.toLowerCase()

    const [allowances, approvals] = yield all([
      fillAuthorizations(payload.allowances, (tokenContract, contract) =>
        tokenContract.allowance(address, contract.address)
      ),
      fillAuthorizations(payload.approvals, (tokenContract, contract) =>
        tokenContract.isApprovedForAll(address, contract.address)
      )
    ])

    const authorizations = { allowances, approvals }

    yield put(fetchAuthorizationsSuccess(address, authorizations))
  } catch (error) {
    yield put(fetchAuthorizationsFailure(error.message))
  }
}

function* fillAuthorizations(contractsToReview, contractCall) {
  const authorizations = {}

  for (const contractName in contractsToReview) {
    const contract = eth.getContract(contractName)
    const tokenContractNames = contractsToReview[contractName]

    for (const tokenContractName of tokenContractNames) {
      let result = yield call(() =>
        contractCall(eth.getContract(tokenContractName), contract)
      )
      result =
        typeof result.toNumber === 'function' ? result.toNumber() : result // handle BigNumbers

      authorizations[contractName] = {
        ...authorizations[contractName],
        [tokenContractName]: result
      }
    }
  }

  return authorizations
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

    const txHash = yield call(() =>
      tokenContract.approve(contractToApprove.address, amount)
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

import { buildTransactionPayload } from '@dapps/modules/transaction/utils'

// Fetch authorization

export const FETCH_AUTHORIZATION_REQUEST = '[Request] Fetch Authorization'
export const FETCH_AUTHORIZATION_SUCCESS = '[Success] Fetch Authorization'
export const FETCH_AUTHORIZATION_FAILURE = '[Failure] Fetch Authorization'

export function fetchAuthorizationRequest(address, { allowances, approvals }) {
  return {
    type: FETCH_AUTHORIZATION_REQUEST,
    payload: {
      address,
      allowances,
      approvals
    }
  }
}

export function fetchAuthorizationSuccess(address, authorization) {
  return {
    type: FETCH_AUTHORIZATION_SUCCESS,
    payload: {
      address,
      authorization
    }
  }
}

export function fetchAuthorizationFailure(error) {
  return {
    type: FETCH_AUTHORIZATION_FAILURE,
    payload: {
      error
    }
  }
}

// Approve Token

export const ALLOW_TOKEN_REQUEST = '[Request] Allow Token'
export const ALLOW_TOKEN_SUCCESS = '[Success] Allow Token'
export const ALLOW_TOKEN_FAILURE = '[Failure] Allow Token'

export function allowTokenRequest(
  amount,
  contractName,
  tokenContractName = null // optional
) {
  return {
    type: ALLOW_TOKEN_REQUEST,
    payload: {
      amount,
      contractName,
      tokenContractName
    }
  }
}

export function allowTokenSuccess(
  txHash,
  address,
  amount,
  contractName,
  tokenContractName
) {
  return {
    type: ALLOW_TOKEN_SUCCESS,
    payload: {
      ...buildTransactionPayload(txHash, {
        address,
        amount,
        contractName,
        tokenContractName
      }),
      address,
      amount,
      contractName,
      tokenContractName
    }
  }
}

export function allowTokenFailure(error) {
  return {
    type: ALLOW_TOKEN_FAILURE,
    payload: {
      error
    }
  }
}

// Approve Token

export const APPROVE_TOKEN_REQUEST = '[Request] Approve Token'
export const APPROVE_TOKEN_SUCCESS = '[Success] Approve Token'
export const APPROVE_TOKEN_FAILURE = '[Failure] Approve Token'

export function approveTokenRequest(
  isApproved,
  contractName,
  tokenContractName = null // optional
) {
  return {
    type: APPROVE_TOKEN_REQUEST,
    payload: {
      isApproved,
      contractName,
      tokenContractName
    }
  }
}

export function approveTokenSuccess(
  txHash,
  address,
  isApproved,
  contractName,
  tokenContractName
) {
  return {
    type: APPROVE_TOKEN_SUCCESS,
    payload: {
      ...buildTransactionPayload(txHash, {
        address,
        isApproved,
        contractName,
        tokenContractName
      }),
      address,
      isApproved,
      contractName,
      tokenContractName
    }
  }
}

export function approveTokenFailure(error) {
  return {
    type: APPROVE_TOKEN_FAILURE,
    payload: {
      error
    }
  }
}

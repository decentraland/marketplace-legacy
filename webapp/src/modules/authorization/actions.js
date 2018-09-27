import { buildTransactionAction } from 'modules/transaction/utils'

// Fetch authorizations

export const FETCH_AUTHORIZATIONS_REQUEST = '[Request] Fetch Authorizations'
export const FETCH_AUTHORIZATIONS_SUCCESS = '[Success] Fetch Authorizations'
export const FETCH_AUTHORIZATIONS_FAILURE = '[Failure] Fetch Authorizations'

export function fetchAuthorizationsRequest(address, { allowances, approvals }) {
  return {
    type: FETCH_AUTHORIZATIONS_REQUEST,
    payload: {
      address,
      allowances,
      approvals
    }
  }
}

export function fetchAuthorizationsSuccess(address, authorizations) {
  return {
    type: FETCH_AUTHORIZATIONS_SUCCESS,
    payload: {
      address,
      authorizations
    }
  }
}

export function fetchAuthorizationsFailure(error) {
  return {
    type: FETCH_AUTHORIZATIONS_FAILURE,
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
    ...buildTransactionAction(txHash, {
      address,
      amount,
      contractName,
      tokenContractName
    }),
    payload: {
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
    ...buildTransactionAction(txHash, {
      address,
      isApproved,
      contractName,
      tokenContractName
    }),
    payload: {
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

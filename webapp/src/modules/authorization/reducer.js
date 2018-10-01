import {
  FETCH_AUTHORIZATION_REQUEST,
  FETCH_AUTHORIZATION_SUCCESS,
  FETCH_AUTHORIZATION_FAILURE,
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'

/* {
[address]: {
  allowances: {
    [contractName]: { [tokenContractName]: amount, (...) }
  },
  approvals: {
    [contractName]: { [tokenContractName]: isApproved, (...) }
  }
} */
const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}
const EMPTY_ADDRESS_STATE = { allowances: {}, approvals: {} }

export function authorizationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AUTHORIZATION_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AUTHORIZATION_SUCCESS: {
      const { address, authorization } = action.payload
      const addressState = state.data[address] || EMPTY_ADDRESS_STATE

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [address]: {
            ...state.data[address],
            allowances: {
              ...addressState.allowances,
              ...authorization.allowances
            },
            approvals: {
              ...addressState.approvals,
              ...authorization.approvals
            }
          }
        }
      }
    }
    case FETCH_AUTHORIZATION_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.payload.error
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.payload.transaction

      switch (transaction.actionType) {
        case ALLOW_TOKEN_SUCCESS: {
          const {
            address,
            amount,
            contractName,
            tokenContractName
          } = transaction.payload
          const addressState = state.data[address] || EMPTY_ADDRESS_STATE

          const allowances = {
            ...addressState.allowances,
            [contractName]: {
              ...addressState.allowances[contractName],
              [tokenContractName]: amount
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { approvals: {}, ...state.data[address], allowances }
            }
          }
        }
        case APPROVE_TOKEN_SUCCESS: {
          const {
            address,
            isApproved,
            contractName,
            tokenContractName
          } = transaction.payload
          const addressState = state.data[address] || EMPTY_ADDRESS_STATE

          const approvals = {
            ...addressState.approvals,
            [contractName]: {
              ...addressState.approvals[contractName],
              [tokenContractName]: isApproved
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { allowances: {}, ...state.data[address], approvals }
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

import {
  FETCH_AUTHORIZATIONS_REQUEST,
  FETCH_AUTHORIZATIONS_SUCCESS,
  FETCH_AUTHORIZATIONS_FAILURE,
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'

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

export function authorizationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_AUTHORIZATIONS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_AUTHORIZATIONS_SUCCESS: {
      const { address, authorizations } = action
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [address]: {
            ...state.data[address],
            allowances: {
              ...(state.data[address] || {}).allowances,
              ...authorizations.allowances
            },
            approvals: {
              ...(state.data[address] || {}).approvals,
              ...authorizations.approvals
            }
          }
        }
      }
    }
    case FETCH_AUTHORIZATIONS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case ALLOW_TOKEN_SUCCESS: {
          const {
            address,
            isApproved,
            contractName,
            tokenContractName
          } = transaction.payload

          console.log(
            'ALLOW_TOKEN_SUCCESS',
            state.data,
            address,
            state.data[address].approvals
          )

          const approvals = {
            ...state.data[address].approvals,
            [contractName]: {
              ...state.data[address].approvals[contractName],
              [tokenContractName]: isApproved
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { ...state.data[address], approvals }
            }
          }
        }
        case APPROVE_TOKEN_SUCCESS: {
          const {
            address,
            amount,
            contractName,
            tokenContractName
          } = transaction.payload

          console.log(
            'APPROVE_TOKEN_SUCCESS',
            state.data,
            address,
            state.data[address].allowances
          )

          const allowances = {
            ...state.data[address].allowances,
            [contractName]: {
              ...state.data[address].allowances[contractName],
              [tokenContractName]: amount
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              [address]: { ...state.data[address], allowances }
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

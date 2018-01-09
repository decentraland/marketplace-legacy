import types from './types'
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ui from 'modules/ui/reducer'

const INITIAL_STATE = {
  web3Connected: false,
  ethereumConnection: {
    ethereum: null,
    address: null,
    ledger: false
  },
  userParcels: { loading: true }
}

function getWeb3Connected(state) {
  return state.web3Connected
}
function getEthereumConnection(state) {
  return state.ethereumConnection
}
function getAddress(state) {
  return state.ethereumConnection.address
}
function getUserParcels(state) {
  return state.userParcels
}

export const selectors = {
  getWeb3Connected,
  getEthereumConnection,
  getAddress,
  getUserParcels
}

function web3Connected(state = INITIAL_STATE.web3Connected, action) {
  switch (action.type) {
    case types.connectWeb3.success:
      return true
    case types.connectWeb3.failed:
      return false
    default:
      return state
  }
}

function ethereumConnection(state = INITIAL_STATE.ethereumConnection, action) {
  switch (action.type) {
    case types.connectWeb3.success:
      return {
        ethereum: action.ethereum,
        address: action.address,
        ledger: action.ledger
      }
    case types.connectWeb3.failed:
      return false
    default:
      return state
  }
}

function userParcels(state = INITIAL_STATE.userParcels, action) {
  switch (action.type) {
    case types.fetchUserParcels.request:
      return { ...state, loading: true, error: null }
    case types.fetchUserParcels.success:
      return { loading: false, error: null, data: action.userParcels }
    case types.fetchUserParcels.failed:
      return { ...state, loading: false, error: action.error }
    default:
      return state
  }
}

export function analytics(state, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return null
    // Customize how certain actions report to analytics here
    default:
      return action
  }
}

//---------
export default combineReducers({
  ui,
  router,
  web3Connected,
  ethereumConnection,
  userParcels
})

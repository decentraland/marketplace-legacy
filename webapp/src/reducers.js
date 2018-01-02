import types from './types'

const INITIAL_STATE = {
  loading: false, // Comunicate that *something* is loading. Should be manually set to false again

  web3Connected: false,
  ethereumConnection: {
    ethereum: null,
    address: null,
    ledger: false
  },

  range: {
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0
  },

  modal: {
    open: false,
    name: '',
    data: null
  },

  sidebar: {
    open: false
  }
}

function getWeb3Connected(state) {
  return state.web3Connected
}
function getEthereumConnection(state) {
  return state.ethereumConnection
}
function getLoading(state) {
  return state.loading
}
function getSidebar(state) {
  return state.sidebar
}
function getRange(state) {
  return state.range
}
function getModal(state) {
  return state.modal
}

export const selectors = {
  getWeb3Connected,
  getEthereumConnection,
  getLoading,
  getSidebar,
  getRange,
  getModal
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

function loading(state = INITIAL_STATE.loading, action) {
  switch (action.type) {
    case types.setLoading:
      return action.loading
    default:
      return state
  }
}

function sidebar(state = INITIAL_STATE.sidebar, action) {
  switch (action.type) {
    case types.sidebar.open:
      return {
        open: true
      }
    case types.deleteUnconfirmedBid:
    case types.appendUnconfirmedBid:
    case types.parcelRangeChanged:
      return {
        open: false
      }
    case types.sidebar.close:
      return INITIAL_STATE.sidebar
    default:
      return state
  }
}

function range(state = INITIAL_STATE.range, action) {
  switch (action.type) {
    case types.parcelRangeChanged:
      return action
    default:
      return state
  }
}

function modal(state = INITIAL_STATE.modal, action) {
  switch (action.type) {
    case types.modal.open:
      return {
        open: true,
        name: action.name,
        data: action.data
      }
    case types.modal.close:
      return INITIAL_STATE.modal
    default:
      return state
  }
}

export default {
  web3Connected,
  ethereumConnection,
  loading,
  sidebar,
  range,
  modal
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

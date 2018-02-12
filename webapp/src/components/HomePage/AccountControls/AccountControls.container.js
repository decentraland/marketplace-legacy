import { connect } from 'react-redux'

import { getWallet } from 'modules/wallet/selectors'

import AccountControls from './AccountControls'

const mapState = state => {
  return {
    address: getWallet(state).address
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AccountControls)

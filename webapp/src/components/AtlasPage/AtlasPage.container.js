import { connect } from 'react-redux'

import { getWallet, isConnecting } from 'modules/wallet/selectors'

import AtlasPage from './AtlasPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isConnecting(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AtlasPage)

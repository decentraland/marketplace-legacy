import { connect } from 'react-redux'

import { getWallet } from 'modules/wallet/selectors'

import AtlasPage from './AtlasPage'

const mapState = state => {
  return {
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AtlasPage)

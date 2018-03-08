import { connect } from 'react-redux'

import { getWallet, isLoading } from 'modules/wallet/selectors'
import { openModal } from 'modules/ui/actions'

import AtlasPage from './AtlasPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AtlasPage)

import { connect } from 'react-redux'

import { getWallet, isLoading } from 'modules/wallet/selectors'
import { fetchWalletRequest } from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(fetchWalletRequest())
})

export default connect(mapState, mapDispatch)(SettingsPage)

import { connect } from 'react-redux'

import { getWallet, isLoading } from 'modules/wallet/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onApproveMana: mana => dispatch(console.log),
  onAuthorizeLand: isAuthorized => dispatch(console.log)
})

export default connect(mapState, mapDispatch)(SettingsPage)

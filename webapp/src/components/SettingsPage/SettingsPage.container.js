import { connect } from 'react-redux'

import { getWallet, isConnecting, isConnected } from 'modules/wallet/selectors'
import {
  approveManaRequest,
  authorizeLandRequest,
  updateDerivationPath
} from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isConnecting(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onApproveMana: mana => dispatch(approveManaRequest(mana)),
  onAuthorizeLand: isAuthorized => dispatch(authorizeLandRequest(isAuthorized)),
  onUpdateDerivationPath: derivationPath =>
    dispatch(updateDerivationPath(derivationPath))
})

export default connect(mapState, mapDispatch)(SettingsPage)

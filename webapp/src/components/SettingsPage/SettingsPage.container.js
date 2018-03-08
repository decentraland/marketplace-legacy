import { connect } from 'react-redux'

import { getWallet, isLoading, getError } from 'modules/wallet/selectors'
import {
  connectWalletRequest,
  approveManaRequest,
  authorizeLandRequest,
  updateDerivationPath
} from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isLoading(state),
    hasError: !!getError(state)
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onApproveMana: mana => dispatch(approveManaRequest(mana)),
  onAuthorizeLand: isAuthorized => dispatch(authorizeLandRequest(isAuthorized)),
  onUpdateDerivationPath: derivationPath =>
    dispatch(updateDerivationPath(derivationPath))
})

export default connect(mapState, mapDispatch)(SettingsPage)

import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import {
  getWallet,
  isConnecting,
  isConnected,
  isBuyManaTransactionIdle
} from 'modules/wallet/selectors'
import { locations } from 'locations'

import BuyManaPage from './BuyManaPage'
import { buyManaRequest } from 'modules/wallet/actions'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isConnecting(state),
    isConnected: isConnected(state),
    isTxIdle: isBuyManaTransactionIdle(state)
  }
}

const mapDispatch = dispatch => ({
  onSubmit: (mana, tx) => dispatch(buyManaRequest(mana, tx)),
  onCancel: () => dispatch(replace(locations.settings()))
})

export default withRouter(connect(mapState, mapDispatch)(BuyManaPage))

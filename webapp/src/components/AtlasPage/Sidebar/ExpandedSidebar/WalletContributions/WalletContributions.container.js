import { connect } from 'react-redux'
import { getWallet, isLoading, getError } from 'modules/wallet/selectors'

import WalletContributions from './WalletContributions'

const mapState = state => {
  return {
    isLoading: isLoading(state),
    hasError: !!getError(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(WalletContributions)

import { connect } from 'react-redux'
import { getWallet, isLoading, isError } from 'modules/wallet/reducer'

import WalletContributions from './WalletContributions'

const mapState = state => {
  return {
    isLoading: isLoading(state),
    hasError: isError(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(WalletContributions)

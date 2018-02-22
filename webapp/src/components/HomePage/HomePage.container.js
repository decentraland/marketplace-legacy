import { connect } from 'react-redux'

import { getWallet, isLoading } from 'modules/wallet/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'
import { openModal } from 'modules/ui/actions'

import HomePage from './HomePage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onFirstVisit: () => dispatch(openModal('TermsModal'))
})

export default connect(mapState, mapDispatch)(HomePage)

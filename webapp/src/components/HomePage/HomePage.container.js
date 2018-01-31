import { connect } from 'react-redux'
import { fetchWalletRequest, isLoading } from 'modules/wallet/actions'
import { openModal } from 'modules/ui/actions'

import HomePage from './HomePage'

const mapState = state => {
  return {
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(fetchWalletRequest()),
  onFirstVisit: () => dispatch(openModal('TermsModal'))
})

export default connect(mapState, mapDispatch)(HomePage)

import { connect } from 'react-redux'
import { openModal } from 'modules/ui/actions'
import { fetchWallet } from 'modules/wallet/actions'

import HomePage from './HomePage'

const mapState = state => {
  return {
    isReady: true
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(fetchWallet()),
  onFirstVisit: () => dispatch(openModal('TermsModal'))
})

export default connect(mapState, mapDispatch)(HomePage)

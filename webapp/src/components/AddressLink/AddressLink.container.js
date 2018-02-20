import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/selectors'

import AddressLink from './AddressLink'

const mapState = (state, { address }) => {
  const wallet = getWallet(state)
  return {
    isUser: wallet.address === address
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AddressLink)

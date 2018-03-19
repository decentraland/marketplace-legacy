import { connect } from 'react-redux'

import { getNetwork } from 'modules/wallet/selectors'

import EtherscanLink from './EtherscanLink'

const mapState = state => {
  return {
    network: getNetwork(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(EtherscanLink)

import { connect } from 'react-redux'

import { getNetwork } from 'modules/wallet/selectors'

import BlockDate from './BlockDate'

const mapState = state => {
  return {
    network: getNetwork(state)
  }
}

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(BlockDate)

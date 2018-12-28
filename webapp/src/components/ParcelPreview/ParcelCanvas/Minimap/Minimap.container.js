import { connect } from 'react-redux'

import { getAddress } from 'modules/wallet/selectors'
import Minimap from './Minimap'

export const mapState = state => ({
  address: getAddress(state)
})

export const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Minimap)

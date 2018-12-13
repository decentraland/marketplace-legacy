import { connect } from 'react-redux'

import { isConnecting } from 'modules/wallet/selectors'
import { getData as getAtlas } from 'modules/map/selectors'
import { fetchMapRequest } from 'modules/map/actions'

import ParcelCanvas from './ParcelCanvas'

export const mapState = state => ({
  isConnecting: isConnecting(state),
  atlas: getAtlas(state)
})

export const mapDispatch = dispatch => ({
  onFetchMap: (nw, se) => dispatch(fetchMapRequest(nw, se))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

import { connect } from 'react-redux'

import { isConnecting } from 'modules/wallet/selectors'
import { getData as getTiles } from 'modules/tile/selectors'
import { fetchTilesRequest } from 'modules/tile/actions'

import ParcelCanvas from './ParcelCanvas'

export const mapState = state => ({
  isConnecting: isConnecting(state),
  tiles: getTiles(state)
})

export const mapDispatch = dispatch => ({
  onFetchTiles: (nw, se) => dispatch(fetchTilesRequest(nw, se))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

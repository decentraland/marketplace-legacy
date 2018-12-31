import { connect } from 'react-redux'

import { isConnecting } from 'modules/wallet/selectors'
import { fetchNewTilesRequest } from 'modules/tile/actions'
import { getData as getTiles } from 'modules/tile/selectors'
import ParcelCanvas from './ParcelCanvas'

export const mapState = state => ({
  isConnecting: isConnecting(state),
  tiles: getTiles(state)
})

export const mapDispatch = dispatch => ({
  onFetchNewTiles: from => dispatch(fetchNewTilesRequest(from))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

import { connect } from 'react-redux'
// import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { isConnecting } from 'modules/wallet/selectors'
import { getData as getAtlas } from 'modules/map/selectors'
// import { getData as getParcels } from 'modules/parcels/selectors'
// import { getEstates } from 'modules/estates/selectors'
// import { getDistricts } from 'modules/districts/selectors'
// import { getData as getPublications } from 'modules/publication/selectors'
import { fetchMapRequest } from 'modules/map/actions'

import ParcelCanvas from './ParcelCanvas'

export const mapState = state => ({
  isConnecting: isConnecting(state),
  atlas: getAtlas(state)
  // wallet: getWallet(state),
  // parcels: getParcels(state),
  // estates: getEstates(state),
  // districts: getDistricts(state),
  // publications: getPublications(state)
})

export const mapDispatch = dispatch => ({
  onFetchMap: (nw, se) => dispatch(fetchMapRequest(nw, se))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/selectors'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { fetchParcelsRequest } from 'modules/parcels/actions'

import ParcelCanvas from './ParcelCanvas'

export const mapState = state => {
  return {
    wallet: getWallet(state),
    parcels: getParcels(state),
    districts: getDistricts(state)
  }
}

export const mapDispatch = dispatch => ({
  onFetchParcels: (nw, se) => dispatch(fetchParcelsRequest(nw, se))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

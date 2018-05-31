import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications } from 'modules/publication/selectors'
import { fetchParcelsRequest } from 'modules/parcels/actions'
import { getEstates } from 'modules/estates/selectors'

import ParcelCanvas from './ParcelCanvas'

export const mapState = state => {
  return {
    wallet: getWallet(state),
    parcels: getParcels(state),
    districts: getDistricts(state),
    publications: getPublications(state),
    estates: getEstates(state)
  }
}

export const mapDispatch = dispatch => ({
  onFetchParcels: (nw, se) => dispatch(fetchParcelsRequest(nw, se))
})

export default connect(mapState, mapDispatch)(ParcelCanvas)

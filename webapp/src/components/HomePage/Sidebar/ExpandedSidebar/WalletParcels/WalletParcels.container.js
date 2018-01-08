import { connect } from 'react-redux'
import { selectors } from 'reducers'
import { editParcel } from 'actions'

import WalletParcels from './WalletParcels'

const mapState = state => {
  const parcels = selectors.getUserParcels(state)
  return {
    isLoading: parcels.loading,
    hasError: parcels.error != null,
    parcels: parcels.data
  }
}

const mapDispatch = dispatch => ({
  onEdit: parcel => dispatch(editParcel(parcel))
})

export default connect(mapState, mapDispatch)(WalletParcels)

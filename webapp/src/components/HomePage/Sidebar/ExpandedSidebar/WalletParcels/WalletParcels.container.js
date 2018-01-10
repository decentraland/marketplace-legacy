import { connect } from 'react-redux'
import { editParcel } from 'modules/parcels/actions'

import WalletParcels from './WalletParcels'

const mapState = state => {
  // TODO: Get user parcels here
  const parcels = { data: [] }
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

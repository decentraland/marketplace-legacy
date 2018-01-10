import { connect } from 'react-redux'
import { editParcel } from 'modules/parcels/actions'
import { getWallet, isLoading, isError } from 'modules/wallet/reducer'

import WalletParcels from './WalletParcels'

const mapState = state => {
  return {
    isLoading: isLoading(state),
    hasError: isError(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({
  onEdit: parcel => dispatch(editParcel(parcel))
})

export default connect(mapState, mapDispatch)(WalletParcels)

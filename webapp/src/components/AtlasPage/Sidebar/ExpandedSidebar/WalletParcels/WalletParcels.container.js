import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { locations } from 'locations'
import { editParcelRequest } from 'modules/parcels/actions'
import { getWallet, isLoading, getError } from 'modules/wallet/selectors'

import WalletParcels from './WalletParcels'

const mapState = state => {
  return {
    isLoading: isLoading(state),
    hasError: !!getError(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({
  onEdit: parcel => dispatch(editParcelRequest(parcel)),
  onTransfer: ({ x, y }) => dispatch(push(locations.transferLand(x, y)))
})

export default connect(mapState, mapDispatch)(WalletParcels)

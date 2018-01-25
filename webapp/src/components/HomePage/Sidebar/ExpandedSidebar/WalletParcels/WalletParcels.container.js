import { connect } from 'react-redux'
import { editParcel } from 'modules/parcels/actions'
import { openModal } from 'modules/ui/actions'
import { getWallet, isLoading, getError } from 'modules/wallet/reducer'

import WalletParcels from './WalletParcels'

const mapState = state => {
  return {
    isLoading: isLoading(state),
    hasError: !!getError(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({
  onEdit: parcel => dispatch(editParcel(parcel)),
  onTransfer: parcel => dispatch(openModal('TransferModal', parcel))
})

export default connect(mapState, mapDispatch)(WalletParcels)

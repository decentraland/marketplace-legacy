import { connect } from 'react-redux'
import { getAddress } from 'modules/wallet/reducer'
import { getTransfer, isLoading, getError } from 'modules/transfer/reducer'
import { transferParcelRequest, cleanTransfer } from 'modules/transfer/actions'
import TransferModal from './TransferModal'

const mapState = state => {
  return {
    address: getAddress(state),
    transfer: getTransfer(state),
    error: getError(state),
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onTransfer: (parcel, address) =>
    dispatch(transferParcelRequest(parcel, address)),
  cleanTransfer: () => dispatch(cleanTransfer())
})

export default connect(mapState, mapDispatch)(TransferModal)

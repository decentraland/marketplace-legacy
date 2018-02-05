import { connect } from 'react-redux'
import { getAddress } from 'modules/wallet/selectors'
import { getTransfer, isLoading, getError } from 'modules/transfer/selectors'
import { transferParcel, cleanTransfer } from 'modules/transfer/actions'
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
  onTransfer: (parcel, address) => dispatch(transferParcel(parcel, address)),
  cleanTransfer: () => dispatch(cleanTransfer())
})

export default connect(mapState, mapDispatch)(TransferModal)

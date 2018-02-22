import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { openModal } from 'modules/ui/actions'
import { locations } from 'locations'
import ParcelActions from './ParcelActions'

const mapState = (state, { parcel }) => {
  return {}
}

const mapDispatch = dispatch => ({
  onTransfer: parcel => dispatch(openModal('TransferModal', parcel)),
  onEdit: parcel => dispatch(push(locations.editLand(parcel.x, parcel.y))),
  onSell: parcel => dispatch(push(locations.sellLand(parcel.x, parcel.y)))
})

export default connect(mapState, mapDispatch)(ParcelActions)

import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { locations } from 'locations'
import ParcelActions from './ParcelActions'

const mapState = (state, { parcel }) => {
  return {}
}

const mapDispatch = dispatch => ({
  onTransfer: ({ x, y }) => dispatch(push(locations.transferLand(x, y))),
  onEdit: ({ x, y }) => dispatch(push(locations.editLand(x, y))),
  onSell: ({ x, y }) => dispatch(push(locations.sellLand(x, y)))
})

export default connect(mapState, mapDispatch)(ParcelActions)

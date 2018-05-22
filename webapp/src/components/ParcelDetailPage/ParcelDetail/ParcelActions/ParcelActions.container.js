import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { locations } from 'locations'
import ParcelActions from './ParcelActions'
import { isFetchingParcel } from 'modules/parcels/selectors'
import { isFetchingParcelMortgages } from 'modules/mortgage/selectors'

const mapState = state => ({
  isLoading: isFetchingParcel(state) || isFetchingParcelMortgages(state)
})

const mapDispatch = dispatch => ({
  onTransfer: ({ x, y }) => dispatch(push(locations.transferLand(x, y))),
  onEdit: ({ x, y }) => dispatch(push(locations.editLand(x, y))),
  onSell: ({ x, y }) => dispatch(push(locations.sellLand(x, y))),
  onCancelSale: ({ x, y }) => dispatch(push(locations.cancelSaleLand(x, y)))
})

export default connect(mapState, mapDispatch)(ParcelActions)

import { connect } from 'react-redux'
import ParcelActions from './ParcelActions'
import { isFetchingParcel } from 'modules/parcels/selectors'
import { isFetchingParcelMortgages } from 'modules/mortgage/selectors'

const mapState = state => ({
  isLoading: isFetchingParcel(state) || isFetchingParcelMortgages(state)
})

export default connect(mapState)(ParcelActions)

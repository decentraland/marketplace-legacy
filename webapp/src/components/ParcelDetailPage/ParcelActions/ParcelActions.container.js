import { connect } from 'react-redux'

import { isFetchingParcel } from 'modules/parcels/selectors'
import { isFetchingParcelMortgages } from 'modules/mortgage/selectors'
import ParcelActions from './ParcelActions'

const mapState = state => ({
  isLoading: isFetchingParcel(state) || isFetchingParcelMortgages(state)
})

export default connect(mapState)(ParcelActions)

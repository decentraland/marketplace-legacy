import { connect } from 'react-redux'

import { isFetchingParcel } from 'modules/parcels/selectors'
import { isFetchingParcelMortgages } from 'modules/mortgage/selectors'
import ParcelActions from './ParcelActions'

const mapState = (state, ownProps) => {
  const { x, y } = ownProps.parcel
  return {
    isLoading:
      isFetchingParcel(state, x, y) || isFetchingParcelMortgages(state, x, y)
  }
}

export default connect(mapState)(ParcelActions)

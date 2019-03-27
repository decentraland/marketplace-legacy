import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { getWalletUnarchivedBidsByAsset } from 'modules/archivedBid/selectors'
import { getParcelMortgageFactory } from 'modules/mortgage/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getEstates } from 'modules/estates/selectors'
import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const parcel = ownProps.asset
  const getParcelMortgage = getParcelMortgageFactory(parcel.x, parcel.y)

  return {
    parcel,
    publications: getPublications(state),
    districts: getDistricts(state),
    mortgage: getParcelMortgage(state),
    estates: getEstates(state),
    bids: getWalletUnarchivedBidsByAsset(
      state,
      ownProps.asset,
      ASSET_TYPES.parcel
    )
  }
}

const mapDispatch = dispatch => ({
  onBuy: ({ x, y }) => dispatch(navigateTo(locations.buyParcel(x, y)))
})

export default connect(mapState, mapDispatch)(ParcelDetailPage)

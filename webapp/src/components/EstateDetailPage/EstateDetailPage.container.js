import { connect } from 'react-redux'

import { ASSET_TYPES } from 'shared/asset'
import { getData as getTiles } from 'modules/tile/selectors'
import { navigateToAsset } from 'modules/asset/actions'
import { getData as getPublications } from 'modules/publication/selectors'
import { getWalletUnarchivedBidsByAsset } from 'modules/archivedBid/selectors'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const estate = ownProps.asset

  return {
    publications: getPublications(state),
    tiles: getTiles(state),
    bids: getWalletUnarchivedBidsByAsset(state, estate, ASSET_TYPES.estate),
    estate
  }
}

const mapDispatch = dispatch => ({
  onParcelClick: parcel =>
    dispatch(navigateToAsset(parcel.id, ASSET_TYPES.parcel))
})

export default connect(mapState, mapDispatch)(EstateDetailPage)

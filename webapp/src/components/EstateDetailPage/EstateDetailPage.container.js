import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import { getMatchParams } from 'modules/location/selectors'
import EstateDetailPage from 'components/EstateDetailPage/EstateDetailPage'
import { getData as getParcels } from 'modules/parcels/selectors'

const mapState = (state, ownProps) => {
  const { x, y, tokenId } = getMatchParams(ownProps)
  return {
    tokenId,
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    allParcels: getParcels(state)
  }
}

const mapDispatch = dispatch => ({
  onViewAssetClick: asset => dispatch(navigateTo(locations.assetDetail(asset))),
  onEditParcels: () =>
    dispatch(navigateTo(locations.editEstateParcelsRequest())),
  onEditMetadata: () =>
    dispatch(navigateTo(locations.editEstateMetadataRequest()))
})

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))

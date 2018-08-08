import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import { getMatchParams } from 'modules/location/selectors'
import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest,
  deleteEstateRequest
} from 'modules/estates/actions'
import EstateDetailPage from 'components/EstateDetailPage/EstateDetailPage'
import { getData as getParcels } from 'modules/parcels/selectors'
import { isEstateTransactionIdle } from 'modules/estates/selectors'

const mapState = (state, ownProps) => {
  const { x, y, assetId } = getMatchParams(ownProps)
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    assetId,
    allParcels: getParcels(state),
    isTxIdle: isEstateTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { assetId } = getMatchParams(ownProps)
  return {
    submitEstate: estate =>
      assetId
        ? dispatch(editEstateParcelsRequest(estate))
        : dispatch(createEstateRequest(estate)),
    editEstateMetadata: estate => dispatch(editEstateMetadataRequest(estate)),
    onViewAssetClick: asset =>
      dispatch(navigateTo(locations.assetDetail(asset))),
    onDeleteEstate: () => dispatch(deleteEstateRequest(assetId)),
    onEditParcels: () =>
      dispatch(navigateTo(locations.editEstateParcelsRequest())),
    onEditMetadata: () =>
      dispatch(navigateTo(locations.editEstateMetadataRequest())),
    onCancel: () => dispatch(goBack())
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))

import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import {
  getData as getEstates,
  isEstateTransactionIdle
} from 'modules/estates/selectors'
import EstateSelect from 'components/EstateDetailPage/EstateSelect/EstateSelect'
import { locations } from 'locations'

const mapState = (state, ownProps) => {
  const { assetId } = getMatchParams(ownProps)
  const estates = getEstates(state)
  return {
    allParcels: getParcels(state),
    estatePristine: estates[assetId],
    isTxIdle: isEstateTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y, assetId } = getMatchParams(ownProps)
  return {
    onError: () => dispatch(navigateTo(locations.root)),
    onCreateCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y))),
    onDeleteEstate: () =>
      dispatch(navigateTo(locations.deleteEstatePage(assetId)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateSelect))

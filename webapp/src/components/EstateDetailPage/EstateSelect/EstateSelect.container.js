import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import {
  getData as getEstates,
  isEditingParcelTransactionIdle
} from 'modules/estates/selectors'
import EstateSelect from 'components/EstateDetailPage/EstateSelect/EstateSelect'

const mapState = (state, ownProps) => {
  const { assetId } = getMatchParams(ownProps)
  const estates = getEstates(state)
  return {
    allParcels: getParcels(state),
    estatePristine: estates[assetId],
    isTxIdle: isEditingParcelTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    onError: () => dispatch(navigateTo(locations.root)),
    onCreateCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateSelect))

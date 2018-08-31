import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchEstateRequest } from 'modules/estates/actions'
import { getData as getEstates, getLoading } from 'modules/estates/selectors'
import { getInitialEstate } from 'shared/estate'

import Estate from './Estate'

const mapState = (state, { assetId, x, y }) => {
  const estates = getEstates(state)
  const estate = assetId ? estates[assetId] : getInitialEstate(x, y)
  const isLoading = assetId
    ? getLoading(state).some(estate => estate.asset_id === assetId)
    : false

  return {
    isLoading,
    estate
  }
}

const mapDispatch = (dispatch, { assetId }) => ({
  onLoaded: () => assetId && dispatch(fetchEstateRequest(assetId)),
  onAccessDenied: () => dispatch(push(locations.marketplace))
})

export default connect(mapState, mapDispatch)(Estate)

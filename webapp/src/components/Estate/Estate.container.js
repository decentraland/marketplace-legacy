import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchEstateRequest } from 'modules/estates/actions'
import { getData as getEstates, getLoading } from 'modules/estates/selectors'
import { getInitialEstate } from 'shared/estate'

import Estate from './Estate'

const mapState = (state, { tokenId, x, y }) => {
  const estates = getEstates(state)
  const estate = tokenId ? estates[tokenId] : getInitialEstate(x, y)
  const isLoading = tokenId
    ? getLoading(state).some(estate => estate.token_id === tokenId)
    : false

  return { isLoading, estate }
}

const mapDispatch = (dispatch, { tokenId }) => ({
  onLoaded: () => tokenId && dispatch(fetchEstateRequest(tokenId)),
  onAccessDenied: () => dispatch(push(locations.marketplace))
})

export default connect(mapState, mapDispatch)(Estate)

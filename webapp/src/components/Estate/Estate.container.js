import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchEstateRequest } from 'modules/estates/actions'
import { getData as getEstates, getLoading } from 'modules/estates/selectors'
import { getInitialEstate } from 'shared/estate'

import Estate from './Estate'

const mapState = (state, { id, x, y }) => {
  const estates = getEstates(state)

  const estate = id ? estates[id] : getInitialEstate(x, y)
  const isLoading = id
    ? getLoading(state).some(estate => estate.id === id)
    : false

  return { isLoading, estate }
}

const mapDispatch = (dispatch, { id }) => ({
  onLoaded: () => id && dispatch(fetchEstateRequest(id)),
  onAccessDenied: () => dispatch(push(locations.marketplacePageDefault()))
})

export default connect(mapState, mapDispatch)(Estate)

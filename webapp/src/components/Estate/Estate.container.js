import { connect } from 'react-redux'
import { locations } from 'locations'
import { push } from 'react-router-redux'
import { fetchEstateRequest } from 'modules/estates/actions'
import { getData as getEstates, getLoading } from 'modules/estates/selectors'

import Estate from './Estate'

const mapState = (state, { id }) => {
  const estates = getEstates(state)
  const isLoading = getLoading(state).some(estate => estate.id === id)
  const estate = estates[id]
  return {
    isLoading,
    estate
  }
}

const mapDispatch = (dispatch, { id }) => ({
  onLoaded: () => dispatch(fetchEstateRequest(id)),
  onAccessDenied: () => dispatch(push(locations.estateDetail(id)))
})

export default connect(mapState, mapDispatch)(Estate)

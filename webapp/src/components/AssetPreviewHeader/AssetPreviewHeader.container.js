import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getError, isLoading } from 'modules/parcels/selectors'
import { navigateTo } from '@dapps/modules/location/actions'
import { getCenterCoords } from 'shared/asset'

import AssetPreviewHeader from './AssetPreviewHeader'

const mapState = (state, { asset }) => {
  const { x, y } = getCenterCoords(asset)
  return {
    x,
    y,
    isLoading: isLoading(state),
    error: getError(state)
  }
}

const mapDispatch = dispatch => ({
  onError: () => dispatch(navigateTo(locations.root()))
})

export default withRouter(connect(mapState, mapDispatch)(AssetPreviewHeader))

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchParcelRequest } from 'modules/parcels/actions'
import { getData as getParcels, getLoading } from 'modules/parcels/selectors'
import { splitCoordinate } from 'shared/parcel'
import { getEstates } from 'modules/estates/selectors'
import { fetchEstateRequest } from 'modules/estates/actions'
import AssetLoader from './AssetLoader'
import { ASSET_TYPES } from 'shared/asset'

const mapState = (state, { id, assetType }) => {
  let assets
  switch (assetType) {
    case ASSET_TYPES.parcel:
      assets = getParcels(state)
      break
    case ASSET_TYPES.estate:
      assets = getEstates(state)
      break
  }
  const isLoading = getLoading(state).some(asset => asset.id === id)
  const asset = assets[id]

  return {
    isLoading,
    asset
  }
}

const mapDispatch = (dispatch, { id, assetType }) => {
  const isParcel = assetType === ASSET_TYPES.parcel
  const [x, y] = splitCoordinate(id)
  return {
    onLoaded: () =>
      dispatch(isParcel ? fetchParcelRequest(x, y) : fetchEstateRequest(id)),
    onAccessDenied: () =>
      dispatch(
        push(
          isParcel ? locations.parcelDetail(x, y) : locations.estateDetail(id)
        )
      )
  }
}

export default connect(mapState, mapDispatch)(AssetLoader)

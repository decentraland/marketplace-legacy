import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { fetchAssetRequest } from 'modules/asset/actions'
import {
  getData as getParcels,
  isFetchingParcel
} from 'modules/parcels/selectors'
import { getEstates, isFetchingEstate } from 'modules/estates/selectors'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import AssetLoader from './AssetLoader'

const mapState = (state, { id, assetType }) => {
  let isLoading = false
  let isLoaded = false
  let assets = {}
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(id)
      assets = getParcels(state)
      isLoaded = id in assets
      isLoading = !isLoaded && isFetchingParcel(state, x, y)
      break
    }
    case ASSET_TYPES.estate: {
      assets = getEstates(state)
      isLoaded = id in assets
      isLoading = !isLoaded && isFetchingEstate(state, id)
      break
    }
  }
  const asset = assets[id]

  return { isLoading, asset }
}

const mapDispatch = (dispatch, { id, assetType }) => {
  return {
    onFetchAsset: () => dispatch(fetchAssetRequest(id, assetType)),
    onAccessDenied: () =>
      dispatch(navigateTo(locations.assetDetail(id, assetType)))
  }
}

export default connect(mapState, mapDispatch)(AssetLoader)

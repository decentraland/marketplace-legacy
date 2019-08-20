import {
  getData as getParcels,
  isFetchingParcel
} from 'modules/parcels/selectors'
import { getEstates, isFetchingEstate } from 'modules/estates/selectors'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'

export const getAsset = (state, assetId, assetType) => {
  let assets = {}

  switch (assetType) {
    case ASSET_TYPES.parcel:
      assets = getParcels(state)
      break
    case ASSET_TYPES.estate:
      assets = getEstates(state)
      break
    default:
      throw new Error(`Invalid asset type "${assetType}"`)
  }

  return assets[assetId]
}

export const isLoading = (state, assetId, assetType) => {
  const asset = getAsset(state, assetId, assetType)
  let isLoading = false

  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(assetId)
      isLoading = !asset && isFetchingParcel(state, x, y)
      break
    }
    case ASSET_TYPES.estate:
      isLoading = !asset && isFetchingEstate(state, assetId)
      break
    default:
      throw new Error(`Invalid asset type "${assetType}"`)
  }

  return isLoading
}

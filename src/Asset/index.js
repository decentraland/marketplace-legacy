import { ASSET_TYPES } from '../../shared/asset'
import { Parcel } from './Parcel'
import { Estate } from './Estate'

export { Asset } from './Asset'
export { AssetRouter } from './Asset.router'

export * from './Parcel'
export * from './Estate'

export const ASSETS = {
  [ASSET_TYPES.parcel]: Parcel,
  [ASSET_TYPES.estate]: Estate
}

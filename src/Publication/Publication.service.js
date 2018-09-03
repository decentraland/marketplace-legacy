import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { ASSET_TYPES } from '../shared/asset'

export class PublicationService {
  constructor() {
    this.Publication = Publication
    this.Parcel = Parcel
    this.Estate = Estate
  }

  getModelFromAssetType(assetType) {
    if (!this.Publication.isValidAssetType(assetType)) {
      throw new Error(`Invalid publication asset_type "${assetType}"`)
    }

    return {
      [ASSET_TYPES.parcel]: this.Parcel,
      [ASSET_TYPES.estate]: this.Estate
    }[assetType]
  }
}

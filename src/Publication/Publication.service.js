import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { ASSET_TYPE } from '../shared/asset'

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
      [ASSET_TYPE.parcel]: this.Parcel,
      [ASSET_TYPE.estate]: this.Estate
    }[assetType]
  }
}

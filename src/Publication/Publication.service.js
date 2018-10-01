import { Publication } from './Publication.model'
import { ASSETS } from '../Asset'
import { PUBLICATION_ASSET_TYPES } from '../shared/publication'

export class PublicationService {
  constructor() {
    this.Publication = Publication
  }

  getPublicableAssetFromType(assetType) {
    if (!this.Publication.isValidAssetType(assetType)) {
      throw new Error(`Invalid publication asset_type "${assetType}"`)
    }

    return ASSETS[assetType]
  }

  getPublicableAssets() {
    const publicableAssets = {}

    for (const key in PUBLICATION_ASSET_TYPES) {
      publicableAssets[key] = ASSETS[key]
    }

    return Object.values(publicableAssets)
  }
}

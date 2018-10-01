import { sanitizeParcel } from './sanitizeParcels'
import { sanitizeEstate } from './sanitizeEstates'
import { sanitizePublication } from './sanitizePublications'
import { isParcel } from '../shared/parcel'

export function sanitizeAssets(assets) {
  return assets.map(({ publication, ...asset }) => {
    const newAsset = isParcel(asset)
      ? sanitizeParcel(asset)
      : sanitizeEstate(asset)

    newAsset.publication = publication
      ? sanitizePublication(publication)
      : undefined

    return newAsset
  })
}

import { utils } from 'decentraland-commons'
import { blacklistParcels } from './blacklistParcels'
import { blacklistEstates } from './blacklistEstates'
import { blacklistPublications } from './blacklistPublications'
import { isParcel } from '../shared/parcel'

export function blacklistAssets(assets) {
  return assets.map(({ publication, ...asset }) => {
    const newAsset = isParcel(asset)
      ? blacklistParcels([asset])
      : blacklistEstates([asset])

    newAsset.publication = publication
      ? blacklistPublications([publication])
      : undefined

    return newAsset
  })
}

import { getContractAddress } from 'modules/wallet/utils'
import { ASSET_TYPES } from 'shared/asset'
import { MARKETPLACE_PAGE_TABS } from 'locations'

export function isLegacyPublication(publication) {
  return (
    publication.marketplace_address === getContractAddress('LegacyMarketplace')
  )
}

export function getNFTAddressByType(type) {
  if (type === ASSET_TYPES.parcel) {
    return getContractAddress('LANDRegistry')
  } else if (type === ASSET_TYPES.estate) {
    return getContractAddress('EstateRegistry')
  }
  throw Error('invalid asset type')
}

export function getTypeByMarketplaceTab(tab) {
  switch (tab) {
    case MARKETPLACE_PAGE_TABS.parcels:
      return ASSET_TYPES.parcel
    case MARKETPLACE_PAGE_TABS.estates:
      return ASSET_TYPES.estate
    default:
      return ASSET_TYPES.parcel
  }
}

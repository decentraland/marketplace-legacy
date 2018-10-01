import { getContractAddress } from 'modules/wallet/utils'
import { ASSET_TYPES } from 'shared/asset'
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

import { ASSET_TYPES } from 'shared/asset'
import { getContractAddress } from 'modules/wallet/utils'

export function getNFTAddressByType(type) {
  if (type === ASSET_TYPES.parcel) {
    return getContractAddress('LANDRegistry')
  } else if (type === ASSET_TYPES.estate) {
    return getContractAddress('EstateRegistry')
  }
  throw Error('invalid asset type')
}

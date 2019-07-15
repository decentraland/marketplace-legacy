import { ASSET_TYPES } from 'shared/asset'
import { isOpen } from 'shared/listing'
import { getContractAddress } from 'modules/wallet/utils'

export function getNFTAddressByType(type) {
  switch (type) {
    case ASSET_TYPES.parcel:
      return getContractAddress('LANDRegistry')
    case ASSET_TYPES.estate:
      return getContractAddress('EstateRegistry')
    default:
      throw Error(`Invalid asset type ${type}`)
  }
}

export function isOnSale(asset, publications) {
  return getOpenPublication(asset, publications) != null
}

export function getOpenPublication(asset, publications) {
  if (asset && publications && asset.publication_tx_hash in publications) {
    const publication = publications[asset.publication_tx_hash]
    if (isOpen(publication)) {
      return publication
    }
  }
  return null
}

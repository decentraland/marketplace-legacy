import { getContractAddress } from 'modules/wallet/utils'
import { hasLegacyPublication } from 'modules/publication/utils'
import { ASSET_TYPES } from 'shared/asset'
import { isParcel } from 'shared/parcel'
import { isParcelListable, isListable, isOpen } from 'shared/listing'
import { hasBid } from 'shared/bid'

export function getNFTAddressByType(assetType) {
  switch (assetType) {
    case ASSET_TYPES.parcel:
      return getContractAddress('LANDRegistry')
    case ASSET_TYPES.estate:
      return getContractAddress('EstateRegistry')
    default:
      throw new Error(`Invalid asset type "${assetType}"`)
  }
}

export function isAssetListable(asset) {
  return isParcel(asset) ? isParcelListable(asset) : isListable(asset)
}

export function isBiddeable(wallet, asset, bids) {
  return !hasBid(bids, wallet.address) && isAssetListable(asset)
}

export function canGetMortgage(wallet, asset, publications) {
  return isOnSale(asset, publications) && hasLegacyPublication(asset)
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

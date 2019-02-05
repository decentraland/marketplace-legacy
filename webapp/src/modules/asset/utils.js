import { eth } from 'decentraland-eth'

import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import { getContractAddress } from 'modules/wallet/utils'

export function getNFTAddressByType(type) {
  if (type === ASSET_TYPES.parcel) {
    return getContractAddress('LANDRegistry')
  } else if (type === ASSET_TYPES.estate) {
    return getContractAddress('EstateRegistry')
  }
  throw Error('invalid asset type')
}

export async function buildAsset(assetId, assetType, estates) {
  let asset
  if (assetType === ASSET_TYPES.parcel) {
    const [x, y] = splitCoordinate(assetId)

    const landRegistry = eth.getContract('LANDRegistry')
    const tokenId = await landRegistry.encodeTokenId(x, y)

    asset = {
      id: tokenId.toString(),
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    }
  } else if (assetType === ASSET_TYPES.estate) {
    const estate = estates[assetId]
    asset = {
      id: assetId,
      data: {
        name: estate.data.name,
        parcels: estate.data.parcels
      }
    }
  }

  return { ...asset, type: assetType }
}

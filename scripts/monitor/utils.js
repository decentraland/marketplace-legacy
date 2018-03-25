import { eth } from 'decentraland-commons'

// Serve as crude caches
const debounceCache = {
  // id: timeoutId
}
const assetIdCache = {
  // assetId: tokenId
}

export function debounceEvent(parcelId, eventName, callback, delay = 100) {
  const id = `${parcelId}-${eventName}`
  clearTimeout(debounceCache[id])
  debounceCache[id] = setTimeout(callback, delay)
}

export async function decodeAssetId(assetId) {
  if (!assetIdCache[assetId]) {
    const contract = eth.getContract('LANDRegistry')
    const tokenId = await contract.decodeTokenId(assetId)
    assetIdCache[assetId] = tokenId.toString()
  }

  return assetIdCache[assetId]
}

export function encodeAssetId(x, y) {
  const contract = eth.getContract('LANDRegistry')
  return contract.encodeTokenId(x, y)
}

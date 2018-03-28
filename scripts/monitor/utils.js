import { eth } from 'decentraland-commons'

// Serve as crude caches
const debounceCache = {
  // id: timeoutId
}
const decodedAssetIds = {
  // assetId: tokenId
}
const encodedAssetIds = {
  // [x,y]: assetId
}

export function debounceEvent(parcelId, eventName, callback, delay = 100) {
  const id = `${parcelId}-${eventName}`
  clearTimeout(debounceCache[id])
  debounceCache[id] = setTimeout(callback, delay)
}

export async function decodeAssetId(assetId) {
  if (!decodedAssetIds[assetId]) {
    const contract = eth.getContract('LANDRegistry')
    const tokenId = await contract.decodeTokenId(assetId)
    decodedAssetIds[assetId] = tokenId.toString()
  }

  return decodedAssetIds[assetId]
}

export async function encodeAssetId(x, y) {
  const coord = `${x},${y}`

  if (!encodedAssetIds[coord]) {
    const contract = eth.getContract('LANDRegistry')
    encodedAssetIds[coord] = await contract.encodeTokenId(x, y)
  }

  return encodedAssetIds[coord]
}

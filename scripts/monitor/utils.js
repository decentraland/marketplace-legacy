import { eth } from 'decentraland-commons'

// Serves as a crude debounced cache
const cache = {
  // id: timeoutId
}

export function debounceById(id, callback, delay = 100) {
  clearTimeout(cache[id])
  cache[id] = setTimeout(callback, delay)
}

export async function decodeAssetId(assetId) {
  const contract = eth.getContract('LANDRegistry')
  const tokenId = await contract.decodeTokenId(assetId)
  return tokenId.toString()
}

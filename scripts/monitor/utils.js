import { eth } from 'decentraland-commons'

// Serve as crude caches
const debounceCache = {
  // id: timeoutId
}

export function debounceEvent(parcelId, eventName, callback, delay = 100) {
  const id = `${parcelId}-${eventName}`
  clearTimeout(debounceCache[id])
  debounceCache[id] = setTimeout(callback, delay)
}

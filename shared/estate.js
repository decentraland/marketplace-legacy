import { getParcelMatcher } from './parcel'

export const MAX_PARCELS_PER_TX = 12
export const ZOOM_MULTIPLIER = 7.5

export function isNewEstate(estate) {
  return !estate || !estate.id
}

export function isEstate(asset) {
  return !!asset.data.parcels
}

export function toEstateObject(estatesArray) {
  const estateObject = {}

  for (const estate of estatesArray) {
    if (estate.data.parcels.length > 0) {
      estateObject[estate.id] = normalizeEstate(estate)
    }
  }

  return estateObject
}

export function normalizeEstate(estate) {
  const normalizedEstate = Object.assign({}, estate, {
    publication_tx_hash: estate.publication ? estate.publication.tx_hash : null
  })

  delete normalizedEstate.publication
  return normalizedEstate
}

export function calculateMapProps(parcels, size = 20) {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const huge = 1 / (xs.length + ys.length) * ZOOM_MULTIPLIER // only used for big ass estates
  const normal = (xs.length + ys.length) / (xs.length * ys.length) // used for regular estates
  const zoom = Math.min(1, huge, normal) // prevent zoomin in
  const pan = {
    x: xs.length % 2 === 0 ? size / 2 * zoom : 0,
    y: ys.length % 2 === 0 ? -size / 2 * zoom : 0
  }
  return { center, zoom, pan }
}

export function getInitialEstate(x, y) {
  return {
    data: {
      name: '',
      description: '',
      parcels: [{ x, y }]
    }
  }
}

export function areConnected(parcels) {
  if (parcels.length === 0) {
    return false
  }
  const visited = visitParcel(parcels[0], parcels)
  return visited.length === parcels.length
}

export function visitParcel(parcel, allParcels = [parcel], visited = []) {
  const isVisited = visited.some(getParcelMatcher(parcel))

  if (!isVisited) {
    visited.push(parcel)
    const neighbours = getNeighbours(parcel.x, parcel.y, allParcels)
    neighbours.forEach(neighbours =>
      visitParcel(neighbours, allParcels, visited)
    )
  }
  return visited
}

export function getIsNeighbourMatcher(x, y) {
  return coords =>
    (coords.x === x && (coords.y + 1 === y || coords.y - 1 === y)) ||
    (coords.y === y && (coords.x + 1 === x || coords.x - 1 === x))
}

export function hasNeighbour(x, y, parcels) {
  return parcels.some(getIsNeighbourMatcher(x, y))
}

export function getNeighbours(x, y, parcels) {
  return parcels.filter(getIsNeighbourMatcher(x, y))
}

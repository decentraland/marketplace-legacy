export const MAX_PARCELS_PER_TX = 12

export function isEstate(asset) {
  return !!asset.data.parcels
}

export function getEstateByParcel(parcel, estates) {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate =>
      estate.data.parcels.some(p => p.x === parcel.x && p.y === parcel.y)
    )
}

export function toEstateObject(estatesArray) {
  return estatesArray
    .filter(estate => estate.data.parcels.length)
    .reduce(
      (estates, estate) => ({ ...estates, [estate.asset_id]: estate }),
      {}
    )
}

export function calculateMapProps(parcels, size = 20) {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const zoom = 1 / (xs.length + ys.length) * 7.5
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
  var isVisited = visited.some(
    visitedParcel =>
      visitedParcel.x === parcel.x && visitedParcel.y === parcel.y
  )
  if (!isVisited) {
    visited.push(parcel)
    var neighbours = getNeighbours(parcel.x, parcel.y, allParcels)
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

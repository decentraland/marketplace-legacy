export function isEstate(asset) {
  return !!asset.parcels
}

export function getEstateByParcel(parcel, estates) {
  return Object.keys(estates)
    .map(estateId => estates[estateId])
    .find(estate => estate.id === parcel.owner)
}

export function toEstateObject(estatesArray) {
  const estate = {}
  estatesArray.forEach(e => {
    estate[e.id] = e
    estate[e.id].parcels = e.data.parcels
  })
  return estate
}

export function calculateZoomAndCenter(parcels) {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const zoom = 1 / (xs.length + ys.length) * 7.5
  return { center, zoom }
}

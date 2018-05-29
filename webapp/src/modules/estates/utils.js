export const calculateZoomAndCenter = parcels => {
  const xs = [...new Set(parcels.map(coords => coords.x).sort())]
  const ys = [...new Set(parcels.map(coords => coords.y).sort())]
  const x = xs[parseInt(xs.length / 2, 10)]
  const y = ys[parseInt(ys.length / 2, 10)]
  const center = { x, y }
  const zoom = 1 / (xs.length + ys.length) * 7.5
  return { center, zoom }
}

export const toEstateObject = estatesArray => {
  const estate = {}
  estatesArray.forEach(e => {
    estate[e.id] = e
  })
  return estate
}

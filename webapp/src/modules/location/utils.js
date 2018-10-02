const ATLAS_PATHNAME_REGEXP = /^\/-?\d+\/-?\d+$/i
const PARCEL_PATHNAME_REGEXP = /^\/-?\d+\/-?\d+\/detail$/gi
const MARKETPLACE_PATHNAME_REGEXP = /marketplace\/(parcels|estates).*/g

export function isProfilePage(pathname, address) {
  return (
    pathname.slice(0, 9) === '/address/' &&
    pathname.slice(9, 51).toLowerCase() === address
  )
}

export function isAtlasPage(pathname) {
  return ATLAS_PATHNAME_REGEXP.test(pathname)
}

export function isParcelPage(pathname) {
  return PARCEL_PATHNAME_REGEXP.test(pathname)
}

export function getCenter(pathname) {
  let center = { x: 0, y: 0 }
  if (PARCEL_PATHNAME_REGEXP.test(pathname)) {
    const [x, y] = pathname.split('/').slice(1)
    center = { x: parseInt(x, 10), y: parseInt(y, 10) }
  }

  return center
}

export function isMarketplace(pathname) {
  return MARKETPLACE_PATHNAME_REGEXP.test(pathname)
}

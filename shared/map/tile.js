export const TYPES = Object.freeze({
  myParcels: 'MY_PARCEL_TYPE',
  myParcelsOnSale: 'MY_PARCEL_ON_SALE_TYPE',
  myEstates: 'MY_ESTATE_TYPE',
  myEstatesOnSale: 'MY_ESTATE_ON_SALE_TYPE',
  district: 'DISTRICT_TYPE',
  contribution: 'CONTRIBUTION_TYPE',
  roads: 'ROADS_TYPE',
  plaza: 'PLAZA_TYPE',
  taken: 'TAKEN_TYPE',
  onSale: 'ON_SALE_TYPE',
  unowned: 'UNOWNED_TYPE',
  background: 'BACKGROUND_TYPE',
  loading: 'LOADING_TYPE'
})

export const COLORS = Object.freeze({
  myParcels: '#ff9990',
  myParcelsOnSale: '#ff4053',
  myEstates: '#ff9990',
  myEstatesOnSale: '#ff4053',
  district: '#83428f',
  contribution: '#563db8',
  roads: '#5c5b70',
  plaza: '#61926c',
  taken: '#312d37',
  onSale: '#00d3ff',
  unowned: '#09080a',
  background: '#18141a',
  loadingEven: '#110e13',
  loadingOdd: '#0d0b0e'
})

export function getLabel(name, type) {
  switch (type) {
    case TYPES.district:
    case TYPES.contribution:
      return name || 'District'
    case TYPES.plaza:
      return 'Genesis Plaza'
    case TYPES.roads:
      return 'Road'
    case TYPES.myParcels:
    case TYPES.myParcelsOnSale:
    case TYPES.myEstates:
    case TYPES.myEstatesOnSale:
    case TYPES.taken:
    case TYPES.onSale:
      return name || ''
    case TYPES.unowned:
    case TYPES.background:
    default:
      return null
  }
}

export function getLoadingColor(x, y) {
  return (x + y) % 2 === 0 ? COLORS.loadingEven : COLORS.loadingOdd
}

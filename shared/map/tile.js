export const TYPES = Object.freeze({
  myParcels: 0,
  myParcelsOnSale: 1,
  myEstates: 2,
  myEstatesOnSale: 3,
  district: 4,
  contribution: 5,
  roads: 6,
  plaza: 7,
  taken: 8,
  onSale: 9,
  unowned: 10,
  background: 11,
  loading: 12
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

export function getBackgroundColor(type) {
  switch (type) {
    case TYPES.myParcels:
      return COLORS.myParcels
    case TYPES.myParcelsOnSale:
      return COLORS.myParcelsOnSale
    case TYPES.myEstates:
      return COLORS.myParcels
    case TYPES.myEstatesOnSale:
      return COLORS.myParcelsOnSale
    case TYPES.district:
      return COLORS.district
    case TYPES.contribution:
      return COLORS.contribution
    case TYPES.roads:
      return COLORS.roads
    case TYPES.plaza:
      return COLORS.plaza
    case TYPES.taken:
      return COLORS.taken
    case TYPES.onSale:
      return COLORS.onSale
    case TYPES.unowned:
      return COLORS.unowned
    case TYPES.background:
    default:
      return COLORS.background
  }
}

export function getTextColor(type) {
  switch (type) {
    case TYPES.loading:
    case TYPES.district:
    case TYPES.contribution:
    case TYPES.roads:
    case TYPES.taken:
    case TYPES.unowned:
    case TYPES.background:
      return 'white'
    case TYPES.myParcels:
    case TYPES.myParcelsOnSale:
    case TYPES.myEstates:
    case TYPES.myEstatesOnSale:
    case TYPES.plaza:
    case TYPES.onSale:
    default:
      return 'black'
  }
}

export function getLoadingColor(x, y) {
  return (x + y) % 2 === 0 ? COLORS.loadingEven : COLORS.loadingOdd
}

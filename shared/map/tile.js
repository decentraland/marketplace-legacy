export const TYPES = Object.freeze({
  myParcels: 0,
  myParcelsOnSale: 1,
  myEstates: 2,
  myEstatesOnSale: 3,
  withAccess: 4,
  district: 5,
  contribution: 6,
  roads: 7,
  plaza: 8,
  taken: 9,
  onSale: 10,
  unowned: 11,
  background: 12,
  loading: 13
})

export const COLORS = Object.freeze({
  myParcels: '#ff9990',
  myParcelsOnSale: '#ff4053',
  myEstates: '#ff9990',
  myEstatesOnSale: '#ff4053',
  withAccess: '#ffbd33',
  district: '#5054d4',
  contribution: '#563db8',
  roads: '#716c7a',
  plaza: '#70ac76',
  taken: '#3d3a46',
  onSale: '#00d3ff',
  unowned: '#09080A',
  background: '#18141a',
  loadingEven: '#110e13',
  loadingOdd: '#0d0b0e'
})

export function getBackgroundColor(type, colors = COLORS) {
  switch (type) {
    case TYPES.myParcels:
      return colors.myParcels
    case TYPES.myParcelsOnSale:
      return colors.myParcelsOnSale
    case TYPES.myEstates:
      return colors.myParcels
    case TYPES.myEstatesOnSale:
      return colors.myParcelsOnSale
    case TYPES.withAccess:
      return colors.withAccess
    case TYPES.district:
      return colors.district
    case TYPES.contribution:
      return colors.contribution
    case TYPES.roads:
      return colors.roads
    case TYPES.plaza:
      return colors.plaza
    case TYPES.taken:
      return colors.taken
    case TYPES.onSale:
      return colors.onSale
    case TYPES.unowned:
      return colors.unowned
    case TYPES.background:
    default:
      return colors.background
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
    case TYPES.withAccess:
    case TYPES.plaza:
    case TYPES.onSale:
    default:
      return 'black'
  }
}

export function getLoadingColor(x, y) {
  return (x + y) % 2 === 0 ? COLORS.loadingEven : COLORS.loadingOdd
}

export function shortenOwner(owner = '') {
  return owner.slice(0, 6).toLowerCase()
}

import { isParcel } from 'shared/parcel'

const asCoordinateParam = key => `:${key}(-?\\d+)`
const asIntParam = key => `:${key}(\\d+)`
const params = {
  x: asCoordinateParam('x'),
  y: asCoordinateParam('y'),
  id: asIntParam('id')
}

export const locations = {
  root: () => '/',

  // Addresses

  profilePageDefault: (address = ':address', tab = PROFILE_PAGE_TABS.parcels) =>
    locations.profilePage(address, PROFILE_PAGE_TABS.parcels),

  profilePage: (address = ':address', tab = ':tab') =>
    `/address/${address}/${tab}`,

  // Parcels

  parcelMapDetail: (x = params.x, y = params.y, marker = '') =>
    `/${x}/${y}` + (marker ? `?marker=${marker}` : ''),

  parcelDetail: (x = params.x, y = params.y) => `/parcels/${x}/${y}/detail`,

  sellParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/sell`,
  buyParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/buy`,
  cancelSaleParcel: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/cancel-sale`,

  editParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/edit`,
  manageParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/manage`,
  transferParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/transfer`,

  createEstate: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/create-estate`, // this could be /estates/create once it's parcel independent

  // Estates

  estateDetail: (id = params.id) => `/estates/${id}/detail`,

  editEstateParcels: (id = params.id) => `/estates/${id}/edit-parcels`,
  editEstateMetadata: (id = params.id) => `/estates/${id}/edit-metadata`,

  transferEstate: (id = params.id) => `/estates/${id}/transfer`,
  deleteEstate: (id = params.id) => `/estates/${id}/delete-estate`,
  sellEstate: (id = params.id) => `/estates/${id}/sell`,
  buyEstate: (id = params.id) => `/estates/${id}/buy`,
  cancelSaleEstate: (id = params.id) => `/estates/${id}/cancel-sale`,
  // Generic assets

  assetDetail: function(asset) {
    return isParcel(asset)
      ? this.parcelDetail(asset.x, asset.y)
      : this.estateDetail(asset.id)
  },

  // Mortgages

  buyParcelByMortgage: (x = params.x, y = params.y) =>
    `/mortgages/${x}/${y}/buy`,
  payMortgageParcel: (x = params.x, y = params.y) => `/mortgages/${x}/${y}/pay`,

  // General routes
  marketplace: () => `/marketplace`,

  buyMana: () => '/buy-mana',
  transferMana: () => '/transfer-mana',

  settings: () => '/settings',
  activity: () => '/activity',

  colorKey: () => '/colorKey',

  signIn: () => '/sign-in'
}

export const STATIC_PAGES = [locations.root()]

export const PROFILE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  contributions: 'contributions',
  publications: 'publications',
  estates: 'estates',
  mortgages: 'mortgages'
})

export const NAVBAR_PAGES = Object.freeze({
  atlas: 'Atlas',
  marketplace: 'Marketplace',
  activity: 'Activity',
  profile: 'My Land',
  settings: 'Settings',
  signIn: 'Sign In'
})

export const MARKETPLACE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  estates: 'estates'
})

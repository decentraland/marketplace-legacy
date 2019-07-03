import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'

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

  bidParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/bid`,
  cancelBidParcel: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/cancel-bid`,
  acceptBidParcel: (x = params.x, y = params.y, bidId = ':bidId') =>
    `/parcels/${x}/${y}/accept-bid/${bidId}`,

  // Estates

  estateDetail: (id = params.id) => `/estates/${id}/detail`,

  editEstateParcels: (id = params.id) => `/estates/${id}/edit-parcels`,
  editEstateMetadata: (id = params.id) => `/estates/${id}/edit-metadata`,

  transferEstate: (id = params.id) => `/estates/${id}/transfer`,
  deleteEstate: (id = params.id) => `/estates/${id}/delete-estate`,
  sellEstate: (id = params.id) => `/estates/${id}/sell`,
  buyEstate: (id = params.id) => `/estates/${id}/buy`,
  cancelSaleEstate: (id = params.id) => `/estates/${id}/cancel-sale`,
  manageEstate: (id = params.id) => `/estates/${id}/manage`,
  bidEstate: (id = params.id) => `/estates/${id}/bid`,
  cancelBidEstate: (id = params.id) => `/estates/${id}/cancel-bid`,
  acceptBidEstate: (id = params.id, bidId = ':bidId') =>
    `/estates/${id}/accept-bid/${bidId}`,

  // Generic assets

  assetDetail: function(assetId, assetType) {
    switch (assetType) {
      case ASSET_TYPES.parcel: {
        const [x, y] = splitCoordinate(assetId)
        return this.parcelDetail(x, y)
      }
      case ASSET_TYPES.estate:
        return this.estateDetail(assetId)
      default:
        throw new Error(`Unknown assetType "${assetType}"`)
    }
  },

  // Mortgages

  buyParcelByMortgage: (x = params.x, y = params.y) =>
    `/mortgages/${x}/${y}/buy`,
  payMortgageParcel: (x = params.x, y = params.y) => `/mortgages/${x}/${y}/pay`,

  // Auction

  auction: token => '/auction' + (token ? `?token=${token}` : ''),

  // General routes
  marketplace: () => '/marketplace',

  buyMana: () => '/buy-mana',
  transferMana: () => '/transfer-mana',

  settings: () => '/settings',
  activity: () => '/activity',

  colorKey: () => '/colorKey',

  signIn: () => '/sign-in'
}

export const PROFILE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  contributions: 'contributions',
  publications: 'publications',
  estates: 'estates',
  mortgages: 'mortgages',
  bids: 'bids',
  archivebids: 'archive_bids'
})

export const NAVBAR_PAGES = Object.freeze({
  atlas: 'Atlas',
  marketplace: 'Marketplace',
  activity: 'Activity',
  profile: 'My Land',
  auction: 'Auction',
  settings: 'Settings',
  signIn: 'Sign In'
})

export const MARKETPLACE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  estates: 'estates'
})

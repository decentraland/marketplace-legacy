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
  cancelParcelSale: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/cancel-sale`,

  editParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/edit`,
  manageParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/manage`,
  transferParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/transfer`,

  createEstate: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/create-estate`, // this could be /estates/create once it's parcel independent

  bidParcel: (x = params.x, y = params.y) => `/parcels/${x}/${y}/bid`,
  cancelParcelBid: (x = params.x, y = params.y) =>
    `/parcels/${x}/${y}/cancel-bid`,
  acceptParcelBid: (x = params.x, y = params.y, bidId = ':bidId') =>
    `/parcels/${x}/${y}/accept-bid/${bidId}`,

  // Estates

  estateDetail: (id = params.id) => `/estates/${id}/detail`,

  sellEstate: (id = params.id) => `/estates/${id}/sell`,
  buyEstate: (id = params.id) => `/estates/${id}/buy`,
  cancelEstateSale: (id = params.id) => `/estates/${id}/cancel-sale`,

  editEstateParcels: (id = params.id) => `/estates/${id}/edit-parcels`,
  editEstateMetadata: (id = params.id) => `/estates/${id}/edit-metadata`,
  manageEstate: (id = params.id) => `/estates/${id}/manage`,
  transferEstate: (id = params.id) => `/estates/${id}/transfer`,

  deleteEstate: (id = params.id) => `/estates/${id}/delete-estate`,

  bidEstate: (id = params.id) => `/estates/${id}/bid`,
  cancelEstateBid: (id = params.id) => `/estates/${id}/cancel-bid`,
  acceptEstateBid: (id = params.id, bidId = ':bidId') =>
    `/estates/${id}/accept-bid/${bidId}`,

  // Mortgages

  buyParcelByMortgage: (x = params.x, y = params.y) =>
    `/mortgages/${x}/${y}/buy`,
  payParcelMortgage: (x = params.x, y = params.y) => `/mortgages/${x}/${y}/pay`,

  // Generic assets

  assetDetail: (assetId, assetType) =>
    locations.goToAssetLocation('detail', assetId, assetType),
  bidAsset: (assetId, assetType) =>
    locations.goToAssetLocation('bid', assetId, assetType),
  acceptAssetBid: (assetId, assetType, bidId) =>
    locations.goToAssetLocation('acceptBid', assetId, assetType, bidId),
  cancelAssetBid: (assetId, assetType, bidId) =>
    locations.goToAssetLocation('cancelBid', assetId, assetType, bidId),

  goToAssetLocation(action, assetId, assetType, ...args) {
    const assetLocations = LOCATION_BY_ASSET[assetType]
    if (!assetLocations) {
      throw new Error(`Invalid asset type "${assetType}"`)
    }

    const location = assetLocations[action]
    if (!location) {
      throw new Error(`Invalid asset location "${action}"`)
    }

    return location(assetId, ...args)
  },

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

const LOCATION_BY_ASSET = {
  [ASSET_TYPES.parcel]: {
    detail: withCoordinates((x, y) => locations.parcelDetail(x, y)),
    bid: withCoordinates((x, y) => locations.bidParcel(x, y)),
    acceptBid: withCoordinates((x, y, bidId) =>
      locations.acceptParcelBid(x, y, bidId)
    ),
    cancelBid: withCoordinates((x, y, bidId) =>
      locations.cancelParcelBid(x, y, bidId)
    )
  },
  [ASSET_TYPES.estate]: {
    detail: assetId => locations.estateDetail(assetId),
    bid: assetId => locations.bidEstate(assetId),
    acceptBid: (assetId, bidId) => locations.acceptEstateBid(assetId, bidId),
    cancelBid: (assetId, bidId) => locations.cancelEstateBid(assetId, bidId)
  }
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

function withCoordinates(callback) {
  return (assetId, ...args) => callback(...splitCoordinate(assetId), ...args)
}

import { isParcel } from 'shared/parcel'

export const locations = {
  root: '/',

  profile: '/address/:address/:tab',
  profilePage: (address, tab = PROFILE_PAGE_TABS.parcels) =>
    `/address/${address}/${tab}`,

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y, marker) =>
    `/${x}/${y}` + (marker ? `?marker=${marker}` : ''),

  marketplace: '/marketplace',

  sell: '/:x/:y/sell',
  sellLand: (x, y) => `/${x}/${y}/sell`,

  buy: '/:x/:y/buy',
  buyLand: (x, y) => `/${x}/${y}/buy`,

  cancelSale: '/:x/:y/cancel-sale',
  cancelSaleLand: (x, y) => `/${x}/${y}/cancel-sale`,

  edit: '/:x/:y/edit',
  editLand: (x, y) => `/${x}/${y}/edit`,

  manage: '/:x/:y/manage',
  manageLand: (x, y) => `/${x}/${y}/manage`,

  transfer: '/:x/:y/transfer',
  transferLand: (x, y) => `/${x}/${y}/transfer`,

  estate: '/estates/:assetId/detail',
  estateDetail: assetId => `/estates/${assetId}/detail`,
  editEstateParcels: '/estates/:assetId/edit-parcels',
  editEstateParcelsRequest: () => 'edit-parcels',
  editEstateMetadata: '/estates/:assetId/edit-metadata',
  editEstateMetadataRequest: () => 'edit-metadata',

  deleteEstate: '/estates/:assetId/delete-estate',
  deleteEstatePage: assetId => `/estates/${assetId}/delete-estate`,

  createEstate: '/:x/:y/create-estate',
  createEstateLand: (x, y) => `/${x}/${y}/create-estate`,

  transferEstate: '/estates/:assetId/transfer',
  transferEstatePage: assetId => `/estates/${assetId}/transfer`,

  buyMana: `/buy-mana`,
  transferMana: `/transfer-mana`,

  parcel: '/:x/:y/detail',
  parcelDetail: (x, y) => `/${x}/${y}/detail`,

  assetDetail: function(asset) {
    return isParcel(asset)
      ? this.parcelDetail(asset.x, asset.y)
      : this.estateDetail(asset.asset_id)
  },

  settings: '/settings',
  activity: '/activity',

  colorKey: '/colorKey',
  privacy: '/privacy',
  terms: '/terms',

  error: '/error',
  signIn: '/sign-in',

  mortgage: '/:x/:y/mortgage',
  buyLandByMortgage: (x, y) => `/${x}/${y}/mortgage`,
  payMortgagePath: '/:x/:y/mortgage/pay',
  payMortgage: (x, y) => `/${x}/${y}/mortgage/pay`
}

export const STATIC_PAGES = [locations.root, locations.privacy, locations.terms]

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

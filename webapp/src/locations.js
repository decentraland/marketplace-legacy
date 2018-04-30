export const locations = {
  root: '/',

  profile: '/address/:address/:tab?',
  profilePage: (address, tab = PROFILE_PAGE_TABS.parcels) =>
    `/address/${address}/${tab}`,

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y, marker) =>
    `/${x}/${y}` + (marker ? `?marker=${marker}` : ''),

  marketplace: '/marketplace',

  dashboard: '/dashboard',

  sell: '/:x/:y/sell',
  sellLand: (x, y) => `/${x}/${y}/sell`,

  buy: '/:x/:y/buy',
  buyLand: (x, y) => `/${x}/${y}/buy`,

  cancelSale: '/:x/:y/cancel-sale',
  cancelSaleLand: (x, y) => `/${x}/${y}/cancel-sale`,

  edit: '/:x/:y/edit',
  editLand: (x, y) => `/${x}/${y}/edit`,

  transfer: '/:x/:y/transfer',
  transferLand: (x, y) => `/${x}/${y}/transfer`,

  buyMana: `/buy-mana`,
  transferMana: `/transfer-mana`,

  parcel: '/:x/:y/detail',
  parcelDetail: (x, y) => `/${x}/${y}/detail`,

  settings: '/settings',
  activity: '/activity',

  colorKey: '/colorKey',
  privacy: '/privacy',
  terms: '/terms',

  error: '/error',
  signIn: '/sign-in'
}

export const STATIC_PAGES = [locations.root, locations.privacy, locations.terms]

export const PROFILE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  contributions: 'contributions',
  publications: 'publications'
})

export const NAVBAR_PAGES = Object.freeze({
  marketplace: 'Marketplace',
  activity: 'Activity',
  atlas: 'Atlas',
  profile: 'My Land',
  settings: 'Settings',
  signIn: 'Sign In'
})

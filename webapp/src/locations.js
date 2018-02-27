export const locations = {
  root: '/',

  profile: '/address/:address/:tab?',
  profilePage: (address, tab = PROFILE_PAGE_TABS.parcels) =>
    `/address/${address}/${tab}`,

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y, marker) => `/${x}/${y}` + (marker ? `?marker=${marker}` : ''),
  settings: '/settings',

  marketplace: '/marketplace',

  sell: '/:x/:y/sell',
  sellLand: (x, y) => `/${x}/${y}/sell`,

  edit: '/:x/:y/edit',
  editLand: (x, y) => `/${x}/${y}/edit`,

  parcel: '/:x/:y/detail',
  parcelDetail: (x, y) => `/${x}/${y}/detail`,

  activity: '/activity',

  colorCodes: '/colorCodes',
  privacy: '/privacy',

  error: '/error',
  walletError: '/walletError',
  serverError: '/serverError'
}

export const PROFILE_PAGE_TABS = Object.freeze({
  parcels: 'parcels',
  contributions: 'contributions',
  publications: 'publications'
})

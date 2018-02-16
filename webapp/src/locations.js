export const locations = {
  root: '/',

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y) => `/${x}/${y}`,

  settings: '/settings',

  marketplace: '/marketplace',

  publish: '/:x/:y/publish',
  publishLand: (x, y) => `/${x}/${y}/publish`,

  parcel: '/:x/:y/detail',
  parcelDetail: (x, y) => `/${x}/${y}/detail`,

  activity: '/activity',

  colorCodes: '/colorCodes',
  privacy: '/privacy',

  error: '/error',
  walletError: '/walletError',
  serverError: '/serverError'
}

export const locations = {
  root: '/',

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y) => `/${x}/${y}`,

  settings: '/settings',

  marketplace: '/marketplace',

  publish: '/:x/:y/publish',
  publishLand: (x, y) => `/${x}/${y}/publish`,

  colorCodes: '/colorCodes',
  privacy: '/privacy',

  parcel: '/:x/:y/detail',
  parcelDetail: (x, y) => `/${x}/${y}/detail`,

  parcelTransfer: '/:x/:y/transfer',
  parcelTransferDetail: (x, y) => `/${x}/${y}/transfer`,

  error: '/error',
  walletError: '/walletError',
  serverError: '/serverError'
}

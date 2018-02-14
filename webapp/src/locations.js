export const locations = {
  root: '/',

  parcelMap: '/:x/:y',
  parcelMapDetail: (x, y) => `/${x}/${y}`,

  settings: '/settings',

  marketplace: '/marketplace',

  publish: '/publish/:x/:y',
  publishLand: (x, y) => `/publish/${x}/${y}`,

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

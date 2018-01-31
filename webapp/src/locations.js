export const locations = {
  root: '/',

  parcel: '/:x/:y',
  parcelDetail: (x, y) => `/${x}/${y}`,

  colorCodes: '/colorCodes',

  error: '/error',
  walletError: '/walletError',
  addressError: '/addressError',
  serverError: '/serverError'
}

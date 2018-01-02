export default {
  root: '/',

  parcel: '/:x/:y',
  parcelDetail: (x, y) => `/${x}/${y}`,

  error: '/error',
  walletError: '/walletError',
  addressError: '/addressError',
  serverError: '/serverError'
}

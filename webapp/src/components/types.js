import { txUtils } from 'decentraland-commons'
import { arrayOf, shape, object, string, number, bool, oneOf } from 'prop-types'

export const parcelType = shape({
  id: string.isRequired,
  district_id: string,
  price: string,
  address: string,
  x: number.isRequired,
  y: number.isRequired
})

export const transferType = shape({
  hash: string,
  oldOwner: string,
  newOwner: string
})

export const districtType = shape({
  id: string.isRequired,
  center: string, // Not required since one district has no center
  description: string.isRequired,
  link: string.isRequired,
  name: string.isRequired,
  parcel_count: string, // Not required since Plazas don't have parcel count
  priority: number, // Not required since one district has no prority
  public: bool.isRequired
})

export const transactionType = shape({
  hash: string.isRequired,
  blockNumber: number,
  timestamp: number,
  status: oneOf(Object.values(txUtils.TRANSACTION_STATUS)),
  action: object,
  error: string
})

export const addressType = shape({
  parcel_ids: arrayOf(string).isRequired,
  parcels: arrayOf(parcelType).isRequired
})

export const walletType = shape({
  address: string,
  balance: number,
  approvedBalance: number,
  isLandAuthorized: bool,
  approveManaTransactions: arrayOf(transactionType),
  authorizeLandTransactions: arrayOf(transactionType),
  parcels: arrayOf(parcelType).isRequired
})

export const toastType = shape({
  id: string.isRequired,
  kind: oneOf(['info', 'success', 'error', 'warning']),
  message: string,
  delay: number
})

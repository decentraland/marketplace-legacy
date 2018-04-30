import { txUtils } from 'decentraland-eth'
import {
  arrayOf,
  shape,
  object,
  string,
  number,
  bool,
  oneOf,
  oneOfType
} from 'prop-types'
import { PUBLICATION_STATUS } from 'modules/publication/utils'

export const publicationType = shape({
  tx_hash: string,
  tx_status: oneOf(Object.values(txUtils.TRANSACTION_STATUS)),
  status: oneOf(Object.values(PUBLICATION_STATUS)),
  price: number,
  owner: string,
  buyer: string,
  x: number,
  y: number,
  created_at: oneOfType([number, string]),
  expires_at: oneOfType([number, string])
})

export const parcelType = shape({
  id: string.isRequired,
  district_id: string,
  address: string,
  x: number.isRequired,
  y: number.isRequired,
  publication: publicationType
})

export const contributionType = shape({
  address: string,
  district_id: string,
  land_count: string
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

export const addressType = shape({
  parcel_ids: arrayOf(string).isRequired,
  parcels: arrayOf(parcelType).isRequired
})

export const transactionType = shape({
  hash: string.isRequired,
  blockNumber: number,
  timestamp: number,
  status: oneOf(Object.values(txUtils.TRANSACTION_STATUS)),
  action: object,
  error: string
})

export const walletType = shape({
  network: string, // TODO: Maybe use eth.getNetworks().map(name) to validate here
  address: string,
  balance: number,
  approvedBalance: number,
  isLandAuthorized: bool,
  approveManaTransactions: arrayOf(transactionType),
  authorizeLandTransactions: arrayOf(transactionType),
  parcels: arrayOf(parcelType).isRequired
})

export const transferType = shape({
  txHash: string,
  oldOwner: string,
  newOwner: string,
  parcelId: string
})

export const coordsType = shape({
  x: number,
  y: number
})

export const toastType = shape({
  id: string.isRequired,
  kind: oneOf(['info', 'success', 'error', 'warning']),
  message: string,
  delay: number
})

export const dashboardStatsType = shape({
  landOwnersCount: number,
  activeUsersCount: number,
  totalLandTraded: number,
  totalLandOnSale: number
})

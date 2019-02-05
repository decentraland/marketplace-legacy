import { txUtils } from 'decentraland-eth'
import {
  arrayOf,
  objectOf,
  shape,
  object,
  string,
  number,
  bool,
  oneOf,
  oneOfType
} from 'prop-types'
import { LISTING_STATUS } from 'shared/listing'

export const publicationType = shape({
  tx_hash: string,
  tx_status: oneOf(Object.values(txUtils.TRANSACTION_TYPES)),
  status: oneOf(Object.values(LISTING_STATUS)),
  price: number,
  owner: string,
  buyer: string,
  x: number,
  y: number,
  created_at: oneOfType([number, string]),
  expires_at: oneOfType([number, string])
})

export const coordsType = shape({
  x: number,
  y: number
})

export const assetType = shape({
  id: string,
  owner: string
})

export const parcelType = shape({
  id: string.isRequired,
  district_id: string,
  owner: string,
  is_estate: bool,
  x: number.isRequired,
  y: number.isRequired,
  publication: publicationType,
  tags: object
})

export const estateType = shape({
  id: string,
  owner: string,
  data: object
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
  status: oneOf(Object.values(txUtils.TRANSACTION_TYPES)),
  payload: object,
  action: object,
  error: string
})

export const walletType = shape({
  network: string, // TODO: Maybe use eth.getNetworks().map(name) to validate here
  address: string,
  mana: number,
  parcels: arrayOf(parcelType).isRequired
})

export const authorizationType = shape({
  allowances: objectOf(objectOf(number)),
  approvals: objectOf(objectOf(bool))
})

export const transferType = shape({
  txHash: string,
  oldOwner: string,
  newOwner: string,
  parcelId: string
})

export const mortgageType = shape({
  status: string,
  asset_id: string,
  type: string,
  borrower: string,
  lender: string,
  loan_id: number,
  mortgage_id: number,
  amount: number,
  expires_at: string,
  is_due_at: string,
  payable_at: string,
  outstanding_amount: number
})

export const auctionParamsType = shape({
  availableParcelCount: number,
  gasPriceLimit: number,
  landsLimitPerBid: number
})

export const tileType = shape({
  id: string,
  x: number,
  y: number,
  owner: string,
  price: string,
  name: string,
  type: number,
  left: number,
  top: number,
  topLeft: number
})

export const bidType = shape({
  id: string,
  status: oneOf(Object.values(LISTING_STATUS)),
  price: number,
  owner: string,
  buyer: string,
  asset_id: string,
  asset_type: string,
  expires_at: oneOfType([number, string])
})

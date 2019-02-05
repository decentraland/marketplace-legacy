import { SQL } from '../../database'

export const BidQueries = Object.freeze({
  bidderOrSeller: address => SQL`(seller = ${address} OR bidder = ${address})`
})

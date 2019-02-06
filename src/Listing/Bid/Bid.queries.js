import { SQL } from '../../database'

export const BidQueries = Object.freeze({
  bidderOrSeller: address => SQL`(seller = ${address} OR bidder = ${address})`,
  isForToken: (tokenAddress, tokenId) =>
    SQL`token_address = ${tokenAddress} AND token_id = ${tokenId}`
})

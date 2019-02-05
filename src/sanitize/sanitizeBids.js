import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = [
  'created_at',
  'updated_at',
  'block_number',
  'block_time_created_at',
  'block_time_updated_at'
]

export function sanitizeBids(bids) {
  return utils.mapOmit(bids, BLACKLISTED_PROPERTIES)
}

export function sanitizeBid(bid) {
  return utils.omit(bid, BLACKLISTED_PROPERTIES)
}

import { sortListings, isOpen, LISTING_SORT_BY } from 'shared/listing'
import { localStorage } from 'lib/localStorage'

const ARCHIVE_BIDS = 'decentraland-marketplace-archive-bids'

export function getBidIdFromTxReceipt({ logs }) {
  const createBidLog = logs.find(log => log.name === 'BidCreated')
  const bidIdArg = createBidLog.events.find(args => args.name === '_id')
  return bidIdArg.value
}

/**
 * Returns bids diveded by received and placed
 * @param {array<Bid>} bids
 * @param {string} ethereum address
 * @returns {array<array<Bid>, array<Bid>>}
 */
export function getBidsByReceivedAndPlaced(bids, address) {
  const bidsReceived = []
  const bidsPlaced = []
  const bidProccesed = {}
  for (const bid of bids) {
    if (!bidProccesed[bid.id]) {
      if (isOpen(bid) && bid.seller === address) {
        bidsReceived.push(bid)
      }

      if (bid.bidder === address) {
        bidsPlaced.push(bid)
      }
      bidProccesed[bid.id] = true
    }
  }

  return [bidsReceived, bidsPlaced]
}

/**
 * Order bids by received < placed
 * @param {array<Bid>} bids
 * @param {string} ethereum address
 * @returns {array<Bid>}
 */
export function orderBids(bids, address) {
  const [bidsReceived, bidsPlaced] = getBidsByReceivedAndPlaced(
    sortListings(bids, LISTING_SORT_BY.BLOCK_CREATED),
    address
  )
  return bidsReceived.concat(bidsPlaced)
}

/**
 * Get archive bid ids
 * @return {array<string>} bid ids
 */
export function getArchivedBids() {
  return JSON.parse(localStorage.getItem(ARCHIVE_BIDS)) || {}
}

/**
 * Get whether a bid is archive or not
 * @return {bool} true | false
 */
export function isBidArchived(bidId) {
  return getArchivedBids()[bidId]
}

/**
 * Archive bid
 * @param {string} bid id
 */
export function archiveBid(bidId) {
  const archivedBids = getArchivedBids()
  archivedBids[bidId] = true

  localStorage.setItem(ARCHIVE_BIDS, JSON.stringify(archivedBids))
}

/**
 * Unarchive bid
 * @param {string} bid id
 */
export function unarchiveBid(bidId) {
  const archivedBids = getArchivedBids()
  delete archivedBids[bidId]

  localStorage.setItem(ARCHIVE_BIDS, JSON.stringify(archivedBids))
}

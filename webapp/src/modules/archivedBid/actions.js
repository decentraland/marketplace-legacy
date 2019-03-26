export const ARCHIVE_BID = 'Archive Bid'
export const UNARCHIVE_BID = 'Unarchive Bid'

export function archiveBid(bidId) {
  return {
    type: ARCHIVE_BID,
    bidId
  }
}

export function unarchiveBid(bidId) {
  return {
    type: UNARCHIVE_BID,
    bidId
  }
}

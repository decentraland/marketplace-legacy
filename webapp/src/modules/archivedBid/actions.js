export const ARCHIVE_BID = 'Archive Bid'
export const UNARCHIVE_BID = 'Unarchive Bid'

export function archiveBid(bid) {
  return {
    type: ARCHIVE_BID,
    bid
  }
}

export function unarchiveBid(bid) {
  return {
    type: UNARCHIVE_BID,
    bid
  }
}

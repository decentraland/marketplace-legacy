import { txUtils } from 'decentraland-eth'

export function isOpen(publication, status) {
  return (
    publication &&
    publication.status === status &&
    publication.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(publication)
  )
}
export function isExpired(publication) {
  return parseInt(publication.expires_at, 10) < Date.now()
}

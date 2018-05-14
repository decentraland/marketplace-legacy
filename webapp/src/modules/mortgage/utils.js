import { eth, txUtils } from 'decentraland-eth'
import { isExpired } from 'lib/utils'

// From Mortgage.js on the server
export const MORTGAGES_STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})

// Interest in seconds
export function toInterestRate(r) {
  return Math.trunc(10000000 / r) * 360 * 86400
}

export function daysToSeconds(days) {
  return Math.ceil(days) * 24 * 60 * 60
}

export function getLoanMetadata() {
  const mortgageManagerContract = eth.getContract('MortgageManager')
  return `#mortgage #required-cosigner:${mortgageManagerContract.address}`
}

export function isOpen(publication) {
  return hasStatus(publication, MORTGAGES_STATUS.open)
}

export function hasStatus(mortgage, status) {
  return (
    mortgage &&
    mortgage.status === status &&
    mortgage.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(mortgage)
  )
}

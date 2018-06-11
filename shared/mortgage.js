import { eth } from 'decentraland-eth'
import { hasStatus } from './asset'
import { PUBLICATION_STATUS } from './publication'

export const MORTGAGE_STATUS = Object.freeze({
  pending: 'pending',
  cancelled: 'cancelled',
  ongoing: 'ongoing',
  paid: 'paid',
  defaulted: 'defaulted',
  claimed: 'claimed'
})

export const isMortgagePending = mortgage =>
  hasStatus(mortgage, MORTGAGE_STATUS.pending)
export const isMortgageOngoing = mortgage =>
  hasStatus(mortgage, [MORTGAGE_STATUS.ongoing])
export const isMortgagePaid = mortgage =>
  hasStatus(mortgage, [MORTGAGE_STATUS.paid])

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

export function isMortgageActive(mortgage, parcel, publications) {
  if (mortgage && parcel) {
    const publication = publications[parcel.publication_tx_hash]
    const isPending =
      isMortgagePending(mortgage) &&
      hasStatus(publication, PUBLICATION_STATUS.open)

    return (
      isPending ||
      hasStatus(mortgage, [MORTGAGE_STATUS.ongoing, MORTGAGE_STATUS.paid])
    )
  }
  return false
}

/**
 * Returns mortgages active -> pending status require an open publication
 * @param {array} - mortgages
 * @param  {array} - parcels
 * @returns {array} - mortgages
 */
export function getActiveMortgages(mortgages = [], parcels = {}, publications) {
  return mortgages.filter(mortgage => {
    const parcel = parcels[mortgage.asset_id]
    return isMortgageActive(mortgage, parcel, publications)
  })
}

/**
 * filter actibe mortgages by borrower
 * @param {object} - obj with status & tx_status fields
 * @param  {array} - parcels
 * @returns {object} - mortgage
 */
export function getActiveMortgageByBorrower(
  mortgages = [],
  parcels = {},
  publications = {},
  borrower
) {
  return getActiveMortgages(mortgages, parcels, publications).find(
    mortgage => mortgage && mortgage.borrower === borrower
  )
}

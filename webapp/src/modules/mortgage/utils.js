import { eth } from 'decentraland-eth'

// From Mortgage.js on the server
export const MORTGAGE_STATUS = Object.freeze({
  pending: 'pending',
  ongoing: 'ongoing',
  paid: 'paid',
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

export function getActiveMortgagesByBorrower(mortgages, borrower) {
  return mortgages.filter(
    mortgage => mortgage &&
      mortgage.borrower === borrower &&
      ((mortgage.status === MORTGAGE_STATUS.pending &&
        mortgage.is_publication_open === 1) ||
        mortgage.status === MORTGAGE_STATUS.ongoing)
  )
}

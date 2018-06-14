export const MORTGAGE_STATUS = Object.freeze({
  open: 'open',
  claimed: 'claimed',
  cancelled: 'cancelled'
})

// Interest in seconds
export function toInterestRate(r) {
  return Math.trunc(10000000 / r) * 360 * 86400
}

export function daysToSeconds(days) {
  return Math.ceil(days) * 24 * 60 * 60
}

export function getLoanMetadata(mortgageManagerContractAddress) {
  return `#mortgage #required-cosigner:${mortgageManagerContractAddress}`
}

export function getActiveMortgagesByBorrower(mortgages, borrower) {
  return mortgages.filter(
    mortgage =>
      mortgage &&
      mortgage.borrower === borrower &&
      mortgage.status !== MORTGAGE_STATUS.cancelled
  )
}

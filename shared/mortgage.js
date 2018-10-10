import { hasStatus } from './utils'
import { isOpen } from './publication'

const MORTGAGE_DEFAULT_IN_DAYS = 60 * 60 * 24 * 7 // 7 days

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
  hasStatus(mortgage, MORTGAGE_STATUS.ongoing)
export const isMortgagePaid = mortgage =>
  hasStatus(mortgage, MORTGAGE_STATUS.paid)
export const isMortgageDefaulting = mortgage =>
  Date.now() > parseInt(mortgage.is_due_at * 1000, 10)
export const isMortgageDefaulted = mortgage =>
  hasStatus(mortgage, MORTGAGE_STATUS.defaulted) ||
  (!isMortgagePending(mortgage) &&
    !isMortgagePaid(mortgage) &&
    Date.now() >
      (parseInt(mortgage.is_due_at, 10) + MORTGAGE_DEFAULT_IN_DAYS) * 1000)

// Interest in seconds
export function toInterestRate(r) {
  return Math.trunc(10000000 / r) * 360 * 86400
}

export function daysToSeconds(days) {
  return Math.ceil(days) * 24 * 60 * 60
}

export function getLoanMetadata(mortgageManagerAddress) {
  return `#mortgage #required-cosigner:${mortgageManagerAddress}`
}

export function isMortgageActive(mortgage, parcel, publications) {
  if (mortgage && parcel) {
    const publication = publications[parcel.publication_tx_hash]
    const isPending = isMortgagePending(mortgage) && isOpen(publication)
    return isPending || isMortgageOngoing(mortgage) || isMortgagePaid(mortgage)
  }
  return false
}

/**
 * Returns mortgages active -> pending status require an open publication
 * @param {array} - mortgages
 * @param  {array} - parcels
 * @returns {array} - mortgages
 */
export function getActiveMortgages(
  mortgages = [],
  parcels = {},
  publications = {}
) {
  return mortgages.filter(mortgage => {
    const parcel = parcels[mortgage.asset_id]
    return isMortgageActive(mortgage, parcel, publications)
  })
}

/**
 * filter actibe mortgages by borrower
 * @param {array} - mortgages
 * @param  {object} - parcels
 * @param  {object} - publications
 * @returns {array} - mortgages (active)
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

/**
 * Computes the punitory and non-punitory interest of a given mortgage and returns
 * the outstanding amount
 * @param {mortgage} - Mortgage to compute interest
 * @returns {number} - Mortgage Outstading amount
 */

export function getMortgageOutstandingAmount(mortgage) {
  const oneHour = 60 * 60 // used to ensure the total payment of the mortgage
  if (!mortgage) {
    return 0
  }

  const now = parseInt(Date.now() / 1000, 10)
  const startedTime = parseInt(mortgage.started_at / 1000, 10)
  const isDueAt = parseInt(mortgage.is_due_at, 10)
  let punitoryInterest = 0,
    interest,
    pending,
    deltaTime

  // Won't calculate interest if payable at is now or after
  if (startedTime + parseInt(mortgage.payable_at, 10) >= now) {
    return Math.ceil(mortgage.outstanding_amount)
  }

  if (mortgage.paid < mortgage.amount) {
    pending = mortgage.amount - mortgage.paid
  } else {
    pending = 0
  }

  if (now <= isDueAt) {
    deltaTime = now - startedTime + oneHour
    interest = calculateInterest(deltaTime, mortgage.interest_rate, pending)
  } else {
    // Calculate punitory interest if defaulted
    deltaTime = isDueAt - startedTime
    interest = calculateInterest(deltaTime, mortgage.interest_rate, pending)

    deltaTime = now - isDueAt + oneHour
    const debt = mortgage.amount + interest
    pending = Math.min(debt, debt - mortgage.paid)

    punitoryInterest = calculateInterest(
      deltaTime,
      mortgage.punitory_interest_rate,
      pending
    )
  }
  return Math.ceil(
    mortgage.amount + interest + punitoryInterest - mortgage.paid
  )
}

/**
 * Calculates the interest of a given amount, interest rate and delta time.
 * @param {number} timeDelta Elapsed time
 * @param {number} - Interest rate expressed as the denominator of 10 000 000.
 * @param {number} - amount Amount to apply interest
 * @return {number} - interest
 */
function calculateInterest(timeDelta, interestRate, amount) {
  if (!amount) {
    return 0
  } else {
    return 100000 * amount * timeDelta / interestRate
  }
}

function getMortgageDefaultedTimeLeft(mortgage) {
  return parseInt(
    (parseInt(mortgage.is_due_at, 10) + MORTGAGE_DEFAULT_IN_DAYS) * 1000,
    10
  )
}

export function getMortgageTimeLeft(mortgage) {
  if (isMortgageDefaulting(mortgage)) {
    return getMortgageDefaultedTimeLeft(mortgage)
  } else {
    return parseInt(mortgage.is_due_at * 1000, 10)
  }
}

export function getMortgageDefaultedStatus() {
  return MORTGAGE_STATUS.defaulted
}

export function getMortgageStatus(mortgage) {
  return isMortgageDefaulted(mortgage)
    ? getMortgageDefaultedStatus()
    : mortgage.status
}

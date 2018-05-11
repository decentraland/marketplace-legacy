import { eth } from 'decentraland-eth'

// Interest in seconds
export function toInterestRate(r) {
  return Math.trunc(10000000 / r) * 360 * 86400
}

export function getLoanMetadata() {
  const mortgageManagerContract = eth.getContract('MortgageManager')
  return `#mortgage #required-cosigner:${mortgageManagerContract.address}`
}

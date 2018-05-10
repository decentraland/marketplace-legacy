import { eth } from 'decentraland-eth'

export function toInterestRate(r) {
  return Math.trunc(10000000 / r)
}

export function getLoanMetadata() {
  const mortgageManagerContract = eth.getContract('MortgageManager')
  return `#mortgage #required-cosigner:${mortgageManagerContract.address}`
}

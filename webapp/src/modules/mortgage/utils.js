import { eth } from 'decentraland-eth'

export async function getRequiredDeposit() {
  try {
    const mortgageHelperContract = eth.getContract('MortgageHelper')
    return mortgageHelperContract.requiredTotal()
  } catch (error) {
    return 0
  }
}

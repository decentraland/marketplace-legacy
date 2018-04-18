import { eth } from 'decentraland-eth'
import axios from 'axios'

export const BANCOR_ETH_ID = '5937d635231e97001f744267'
export const BANCOR_MANA_ID = '5a2cfacad0129700019a7270'

export async function fetchManaDefaultRate() {
  const url = `https://api.bancor.network/0.1/currencies/MANA/ticker?fromCurrencyCode=ETH`
  const response = await axios.get(url)
  const defaultRate = 'data' in response.data ? response.data.data.price : null
  return defaultRate
}

export async function fetchManaRate(amount) {
  const amountInWei = eth.utils.toWei(amount)
  const amountAsString = eth.utils.toBigNumber(amountInWei).toString(10)
  const url = `https://api.bancor.network/0.1/currencies/${BANCOR_ETH_ID}/value?toCurrencyId=${BANCOR_MANA_ID}&toAmount=${amountAsString}`
  const response = await axios.get(url)
  const rateInWei = 'data' in response.data ? response.data.data : null
  const rate = eth.utils.fromWei(rateInWei) / amount
  return rate
}

export async function fetchTransaction({ ethAmount, manaAmount, address }) {
  const ethAmountInWei = eth.utils.toWei(ethAmount)
  const manaAmountInWei = eth.utils.toWei(manaAmount * 0.98) // From Bancor docs: "We recommend setting this value to 2% under the expected return amount." (https://support.bancor.network/hc/en-us/articles/360001455772-Build-a-transaction-using-the-Convert-API)
  const url = 'https://api.bancor.network/0.1/currencies/convert'
  const body = {
    blockchainType: 'ethereum',
    fromCurrencyId: BANCOR_ETH_ID,
    toCurrencyId: BANCOR_MANA_ID,
    amount: ethAmountInWei,
    minimumReturn: manaAmountInWei,
    ownerAddress: address
  }
  const response = await axios.post(url, body)
  const {
    data,
    from,
    to,
    gasLimit,
    gasPrice,
    nonce,
    value
  } = response.data.data[0]
  return {
    data,
    from,
    to,
    gas: gasLimit, // WHY BANCOR, WHY??!?1
    gasPrice,
    nonce,
    value
  }
}

export function getSlippage(defaultRate, rate) {
  return Math.abs(defaultRate - rate) / rate
}

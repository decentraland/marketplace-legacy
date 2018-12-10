import axios from 'axios'
import { env } from 'decentraland-commons'
import { getNetwork } from '@dapps/modules/wallet/selectors'

export class EtherscanAPI {
  store = null

  setStore(store) {
    this.store = store
  }

  checkStore() {
    if (!this.store)
      throw new Error(
        'EtherscanAPI Error: You need to set a store via api.setStore(store) before using this method'
      )
  }

  getState() {
    this.checkStore()
    return this.store.getState()
  }

  getBaseURL() {
    const network = getNetwork(this.getState())
    const subdomain = network === 'mainnet' ? 'api' : `api-${network}`
    return `https://${subdomain}.etherscan.io/api`
  }

  async call(params) {
    const response = await axios.get(this.getBaseURL(), {
      params: {
        ...params,
        apikey: env.get('REACT_APP_ETHERSCAN_API_KEY')
      }
    })
    return parseInt(response.data.result, 10)
  }

  balanceOf(address, contractAddress) {
    return this.call({
      module: 'account',
      action: 'tokenbalance',
      contractaddress: contractAddress,
      address,
      tag: 'latest'
    })
  }
}

export const etherscan = new EtherscanAPI()

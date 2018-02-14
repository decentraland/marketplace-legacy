import axios from 'axios'
import _sortBy from 'lodash/sortBy'

import { env } from 'decentraland-commons'

const httpClient = axios.create()
const URL = env.get('REACT_APP_API_URL', '')
const FILTER_DEFAULTS = {
  limit: 20,
  offset: 0,
  sortBy: 'created_at',
  sortOrder: 'asc'
}

const MOCK_PUBLICATIONS = [
  {
    tx_hash:
      '0xf3dfe93e261e6be5ef615ff5da8b09bb4ad4212bfb03dd1b2e41ccafbefefa11',
    address: '0x0de1ec708665b93478bd0ed264e60b68a8663bb4',
    x: 106,
    y: -84,
    price: '10000',
    tx_status: 'pending',
    created_at: 1518474436085,
    expires_at: 1518647236085,
    is_sold: false
  },
  {
    tx_hash:
      '0xc36a170103da0ed4055125b8c39fd49af0efa6a5ee1576297126727bbda6cc42',
    address: '0x0de1ec708665b93478bd0ed264e60b68a8663bb4',
    x: 65,
    y: 38,
    price: '23000',
    tx_status: 'confirmed',
    created_at: 1518474436085,
    expires_at: 1518647236085,
    is_sold: false
  },
  {
    tx_hash:
      '0x5ff0b21b99581a8d86021dfd84e3c08eeffeb4d3490857173f532f8da2154266',
    address: '0x0de1ec708665b93478bd0ed264e60b68a8663bb4',
    x: 45,
    y: 65,
    price: '1000',
    tx_status: 'failed',
    created_at: 1518474436085,
    expires_at: 1518647236085,
    is_sold: false
  },
  {
    tx_hash:
      '0xbce357f29b2acb14f28d79d920fb9f4648158f5123b84e4b3e4045ef8d8fd7d9',
    address: '0x0de1ec708665b93478bd0ed264e60b68a8663bb4',
    x: 89,
    y: 34,
    price: '15000',
    tx_status: 'confirmed',
    created_at: 1518474436085,
    expires_at: 1518647236085,
    is_sold: true
  },
  {
    tx_hash:
      '0x09719587a39352398da2ef774af93fc8050ab33c63d75f7a71f9e12acb2481f2',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 26,
    y: 12,
    price: '20000',
    tx_status: 'confirmed',
    created_at: 1518820036085,
    expires_at: 1518992836085,
    is_sold: false
  },
  {
    tx_hash:
      '0xf7b2def1afb9391e1fc0d99211fc0491888333559f28858182fbaf2ef2033800',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 55,
    y: 55,
    price: '2000',
    tx_status: 'confirmed',
    created_at: 1519120036085,
    expires_at: 1519392836085,
    is_sold: false
  },
  {
    tx_hash:
      '0x62691cf30f29818867f20ea4cae3ff16421e34722733b1d5a2dd64f092b53729',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 76,
    y: 65,
    price: '7000',
    tx_status: 'confirmed',
    created_at: 1519684505522,
    expires_at: 1520030115015,
    is_sold: false
  },
  {
    tx_hash:
      '0xb306d60a2766ca6d4380177598a5413c72cdd74698ccf5cae042be3ea24d30d4',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 33,
    y: 21,
    price: '600',
    tx_status: 'confirmed',
    created_at: 1520202964125,
    expires_at: 1520375770074,
    is_sold: false
  },
  {
    tx_hash:
      '0x8dcaedd1e7aed9ccc54a86eec33e5b1378616e39298de28761aa7d82ea85c845',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 78,
    y: -34,
    price: '3000',
    tx_status: 'confirmed',
    created_at: 1520548623220,
    expires_at: 1520721432816,
    is_sold: false
  },
  {
    tx_hash:
      '0x5a14bad321d481f9f4c9613ca1068b3cbc2ec496e081c7b471613b1280cec1ac',
    address: '0xec6e6c0841a2ba474e92bf42baf76bfe80e8657c',
    x: 99,
    y: -99,
    price: '1000000',
    tx_status: 'confirmed',
    created_at: 1520548623221,
    expires_at: 1520721432816,
    is_sold: false
  }
]

export class API {
  fetchDistricts() {
    return this.request('get', '/districts', {})
  }

  fetchParcels(nw, se) {
    return this.request('get', '/parcels', { nw, se })
  }

  fetchParcelData(x, y) {
    return this.request('get', `/parcels/${x}/${y}/data`, {})
  }

  fetchAddressParcels(address) {
    return this.request('get', `/addresses/${address}/parcels`, {})
  }

  fetchAddressPublications(address) {
    // TODO: remove mock
    return new Promise(resolve =>
      setTimeout(
        () => resolve(MOCK_PUBLICATIONS.filter(x => x.address === address)),
        200
      )
    )
    // return this.request('get', `/addresses/${address}/publications`, {})
  }

  fetchPublications(options = FILTER_DEFAULTS) {
    const { limit, offset, sortBy, sortOrder } = {
      ...FILTER_DEFAULTS,
      ...options
    }

    // TODO: remove mock
    return new Promise(resolve => {
      const result = _sortBy(MOCK_PUBLICATIONS, sortBy).slice(
        offset,
        offset + limit
      )
      setTimeout(
        () => resolve(sortOrder === 'asc' ? result : result.reverse()),
        200
      )
    })

    // return this.request(
    //   'get',
    //   `/publications?limit=${limit}&offset=${offset}&sort_by=${sortBy}&sort_order=${sortOrder}`,
    //   {}
    // )
  }

  fetchAddressContributions(address) {
    return this.request('get', `/addresses/${address}/contributions`, {})
  }

  request(method, path, params) {
    let options = {
      method,
      url: this.getUrl(path)
    }

    if (params) {
      if (method === 'get') {
        options.params = params
      } else {
        options.data = params
      }
    }

    console.log(`[API] ${method} ${path}`, options)

    return httpClient
      .request(options)
      .then(response => {
        const data = response.data
        const result = data.data // One for axios data, another for the servers data

        if (data && !data.ok) {
          const errorMessage = response.error || data.error
          return Promise.reject({ message: errorMessage, data: result })
        }

        return result
      })
      .catch(err => {
        let error

        if (err.status === 401) {
          error = new AuthorizationError()
        } else {
          error = new Error(
            '[API] HTTP request failed. Inspect this error for more info'
          )
          Object.assign(error, err)
        }

        console.warn(`[WARN] ${error.message || ''}`, error)

        throw error
      })
  }

  getUrl(path) {
    return `${URL}/api${path}`
  }
}

export class AuthorizationError {
  constructor() {
    this.status = 401
    this.message = 'Server rejected credentials. Logging out'
  }

  toString() {
    return this.message
  }
}

export const api = new API()

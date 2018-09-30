import axios from 'axios'
import { env } from 'decentraland-commons'
import { PUBLICATION_STATUS } from 'shared/publication'

const httpClient = axios.create()
const URL = env.get('REACT_APP_API_URL', '')
const FILTER_DEFAULTS = {
  limit: 20,
  offset: 0,
  sortBy: 'created_at',
  sortOrder: 'asc',
  status: PUBLICATION_STATUS.open
}

const getFilterOptions = options => {
  return Object.keys(options).reduce((base, key) => {
    base[key] = options[key] == null ? FILTER_DEFAULTS[key] : options[key]
    return base
  }, {})
}

export class API {
  fetchTranslations(locale) {
    return this.request('get', `/translations/${locale}`, {})
  }

  fetchMapInRange(nw, se) {
    return this.request('get', '/map', { nw, se })
  }

  fetchParcel(x, y) {
    return this.request('get', `/parcels/${x}/${y}`)
  }

  fetchAssets(assetName, options = FILTER_DEFAULTS) {
    const { limit, offset, sortBy, sortOrder, status } = getFilterOptions(
      options
    )

    return this.request('get', `/${assetName}`, {
      limit,
      offset,
      sort_by: sortBy,
      sort_order: sortOrder,
      status
    })
  }

  fetchParcelPublications(x, y, status) {
    return this.request('get', `/parcels/${x}/${y}/publications`, { status })
  }

  fetchAddressParcels(address, status) {
    return this.request('get', `/addresses/${address}/parcels`, { status })
  }

  fetchAddressContributions(address) {
    return this.request('get', `/addresses/${address}/contributions`, {})
  }

  fetchAddressEstates(address) {
    return this.request('get', `/addresses/${address}/estates`, {})
  }

  fetchEstate(id) {
    return this.request('get', `/estates/${id}`)
  }

  fetchDistricts() {
    return this.request('get', '/districts', {})
  }

  fetchMortgagedParcels(borrower) {
    return this.request('get', `/mortgages/${borrower}/parcels`)
  }

  fetchMortgagesByBorrower(borrower, status) {
    return this.request('get', `/addresses/${borrower}/mortgages`, { status })
  }

  fetchMortgages(x, y, status) {
    return this.request('get', `/parcels/${x}/${y}/mortgages`, { status })
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
    return `${URL}${path}`
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

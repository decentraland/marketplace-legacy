import queryString from 'query-string'
import { PUBLICATION_STATUS } from 'shared/publication'
import { PAGE_SIZE } from './Pagination'
import { ASSET_TYPES } from '../shared/asset'

export class Location {
  static buildUrl(origin, queryParams) {
    return `${origin}?${queryString.stringify(queryParams)}`
  }

  constructor(location = null) {
    if (location) {
      this.location = location
      this.query = queryString.parse(location.search)
    }
  }

  getPageFromRouter() {
    return this.getOptionFromRouter('page')
  }

  getAssetTypeFromRouter() {
    return this.getOptionFromRouter('assetType')
  }

  getOptionsFromRouter(optionNames) {
    return optionNames.reduce((result, option) => {
      result[option] = this.getOptionFromRouter(option)
      return result
    }, {})
  }

  getOptionFromRouter(optionName) {
    const { sort_by, sort_order, page, asset_type } = this.query
    let value = null

    switch (optionName) {
      case 'limit':
        value = PAGE_SIZE
        break
      case 'offset':
        value = !isNaN(page) && page > 0 ? (page - 1) * PAGE_SIZE : 0
        break
      case 'sortBy':
        value = sort_by ? sort_by : 'created_at'
        break
      case 'sortOrder':
        value = sort_order ? sort_order : 'desc'
        break
      case 'page':
        value = +page || 1
        break
      case 'status':
        value = PUBLICATION_STATUS.open
        break
      case 'assetType':
        value = asset_type || ASSET_TYPES.parcel
        break
      default:
        value = null
    }
    return value
  }

  buildUrl(origin, queryParams = this.query) {
    return Location.buildUrl(origin, queryParams)
  }
}

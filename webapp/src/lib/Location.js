import queryString from 'query-string'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { PAGE_SIZE } from './Pagination'

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

  getOptionsFromRouter(optionNames) {
    return optionNames.reduce((result, option) => {
      result[option] = this.getOptionFromRouter(option)
      return result
    }, {})
  }

  getOptionFromRouter(optionName) {
    const { page, sort_by, sort_order } = this.query
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
      default:
        value = null
    }
    return value
  }

  buildUrl(origin, queryParams = this.query) {
    return Location.buildUrl(origin, queryParams)
  }
}

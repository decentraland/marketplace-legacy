import queryString from 'query-string'
import { locations } from 'locations'
import { t } from 'modules/translation/utils'

export const PAGE_SIZE = 12
let SORT_TYPES = null // filled upon the first call to getSortTypes

export function getSortTypes() {
  if (!SORT_TYPES) {
    SORT_TYPES = Object.freeze({
      NEWEST: t('marketplace.filter.newest'),
      CHEAPEST: t('marketplace.filter.cheapest'),
      MOST_EXPENSIVE: t('marketplace.filter.most_expensive'),
      CLOSEST_TO_EXPIRE: t('marketplace.filter.close_to_expire')
    })
  }
  return SORT_TYPES
}

export function getSortOptions() {
  return Object.values(getSortTypes()).map(type => ({
    text: type,
    value: type
  }))
}

export function buildUrl({ page, sortBy, sortOrder }) {
  return `${locations.marketplace}?${queryString.stringify({
    page,
    sort_by: sortBy,
    sort_order: sortOrder
  })}`
}

export function getPageFromRouter({ search }) {
  const query = queryString.parse(search)
  return +query.page || 1
}

export function getOptionsFromRouter({ search }) {
  const query = queryString.parse(search)
  return {
    limit: PAGE_SIZE,
    offset: query.page ? (query.page - 1) * PAGE_SIZE : 0,
    sortBy: query.sort_by ? query.sort_by : 'created_at',
    sortOrder: query.sort_order ? query.sort_order : 'asc'
  }
}

export function getOptionsFromSortType(type) {
  const sortTypes = getSortTypes()
  switch (type) {
    case sortTypes.CHEAPEST:
      return {
        sortBy: 'price',
        sortOrder: 'asc'
      }
    case sortTypes.MOST_EXPENSIVE:
      return {
        sortBy: 'price',
        sortOrder: 'desc'
      }
    case sortTypes.CLOSEST_TO_EXPIRE:
      return {
        sortBy: 'expires_at',
        sortOrder: 'asc'
      }
    case sortTypes.NEWEST:
    default:
      return {
        sortBy: 'created_at',
        sortOrder: 'asc'
      }
  }
}

export function getSortTypeFromOptions({ sortBy, sortOrder }) {
  return Object.values(getSortTypes())
    .map(sortType => ({ sortType, options: getOptionsFromSortType(sortType) }))
    .find(
      ({ sortType, options }) =>
        sortBy === options.sortBy && sortOrder === options.sortOrder
    ).sortType
}

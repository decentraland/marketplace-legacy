import queryString from 'query-string'
import { locations } from 'locations'

export const PAGE_SIZE = 12
export const SORT_TYPES = {
  NEWEST: 'Newest',
  CHEAPEST: 'Cheapest',
  MOST_EXPENSIVE: 'Most expensive',
  CLOSEST_TO_EXPIRE: 'Closest to expire'
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
  return query.page || 1
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
  switch (type) {
    case SORT_TYPES.CHEAPEST:
      return {
        sortBy: 'price',
        sortOrder: 'asc'
      }
    case SORT_TYPES.MOST_EXPENSIVE:
      return {
        sortBy: 'price',
        sortOrder: 'desc'
      }
    case SORT_TYPES.CLOSEST_TO_EXPIRE:
      return {
        sortBy: 'expires_at',
        sortOrder: 'asc'
      }
    case SORT_TYPES.NEWEST:
    default:
      return {
        sortBy: 'created_at',
        sortOrder: 'asc'
      }
  }
}

export function getSortTypeFromOptions({ sortBy, sortOrder }) {
  return Object.values(SORT_TYPES)
    .map(sortType => ({ sortType, options: getOptionsFromSortType(sortType) }))
    .find(
      ({ sortType, options }) =>
        sortBy === options.sortBy && sortOrder === options.sortOrder
    ).sortType
}

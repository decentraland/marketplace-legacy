import { locations } from 'locations'
import { t } from '@dapps/modules/translation/utils'
import { Location } from 'lib/Location'

let SORT_TYPES = null // filled upon the first call to getSortTypes

export function getSortTypes() {
  if (!SORT_TYPES) {
    SORT_TYPES = Object.freeze({
      NEWEST: t('marketplace.filter.newest'),
      CHEAPEST: t('marketplace.filter.cheapest'),
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

export function getOptionsFromSortType(type) {
  const sortTypes = getSortTypes()
  switch (type) {
    case sortTypes.CHEAPEST:
      return {
        sortBy: 'price',
        sortOrder: 'asc'
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
        sortOrder: 'desc'
      }
  }
}

export function getSortTypeFromOptions({ sortBy, sortOrder }) {
  try {
    return Object.values(getSortTypes())
      .map(sortType => ({
        sortType,
        options: getOptionsFromSortType(sortType)
      }))
      .find(
        ({ sortType, options }) =>
          sortBy === options.sortBy && sortOrder === options.sortOrder
      ).sortType
  } catch (error) {
    const sortTypes = getSortTypes()
    return sortTypes.NEWEST
  }
}

export function getOptionsFromRouter(location) {
  return new Location(location).getOptionsFromRouter([
    'limit',
    'offset',
    'sortBy',
    'sortOrder',
    'status'
  ])
}

export function buildUrl({ tab, page, sortBy, sortOrder }) {
  return Location.buildUrl(locations.marketplace(tab), {
    page,
    sort_by: sortBy,
    sort_order: sortOrder
  })
}

import queryString from 'query-string'
import { locations } from 'locations'

export const PAGE_SIZE = 12
export const TABS = {
  PARCELS: 'parcels',
  CONTRIBUTIONS: 'contributions',
  PUBLICATIONS: 'publications'
}

export function buildUrl({ address, tab, page }) {
  return `${locations.profilePage(address, tab)}?${queryString.stringify({
    page
  })}`
}

export function getPageFromRouter({ search }) {
  const query = queryString.parse(search)
  return +query.page || 1
}

export function paginate(array, page) {
  const offset = (page - 1) * PAGE_SIZE
  const grid = array.slice(offset, offset + PAGE_SIZE)
  return [grid, grid.length === 0, Math.ceil(array.length / PAGE_SIZE)]
}

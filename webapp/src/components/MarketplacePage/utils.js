import QueryString from 'query-string'
export const PAGE_SIZE = 20

export function getPageFromRouter({ search }) {
  const query = QueryString.parse(search)
  return query.page || 1
}

export function getOptionsFromRouter({ search }) {
  const query = QueryString.parse(search)
  return {
    limit: PAGE_SIZE,
    offset: query.page ? (query.page - 1) * PAGE_SIZE : 0,
    sortBy: query.sort_by ? query.sort_by : 'created_at',
    sortOrder: query.sort_order ? query.sort_order : 'asc'
  }
}

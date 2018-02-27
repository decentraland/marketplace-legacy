import queryString from 'query-string'

export function getMarker(location) {
  const parsed = queryString.parse(location.search)
  return parsed.marker || null
}

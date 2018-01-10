export const CHANGE_LOCATION = 'Navigate to URL'

export function navigateTo(url) {
  return {
    type: CHANGE_LOCATION,
    url
  }
}

// Navigate to

export const NAVIGATE_TO = 'Navigate to URL'

export function navigateTo(url) {
  return {
    type: NAVIGATE_TO,
    url
  }
}

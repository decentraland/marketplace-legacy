import { track } from './utils'
import './track'

const disabledMiddleware = store => next => action => {
  next(action)
}

export function createAnalyticsMiddleware(apiKey) {
  if (!apiKey) {
    console.warn(
      'Analytics: middleware disabled due to missing Segment API key'
    )
    return disabledMiddleware
  }
  if (!window.analytics) {
    console.warn(
      'Analytics: middleware disabled because `window.analytics` is not present'
    )
    return disabledMiddleware
  }

  window.analytics.load(apiKey)
  return store => next => action => {
    track(action)
    next(action)
  }
}

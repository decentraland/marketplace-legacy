export default function createAnalyticsMiddleware(sendEvent, reducer) {
  if (!reducer) reducer = action => action

  return store => next => action => {
    if (sendEvent) {
      const event = reducer(store.getState(), action)

      if (event != null) {
        sendEvent(event)
      }
    }

    return next(action)
  }
}

export function createGoogleAnalyticsMiddleware(reducer) {
  return createAnalyticsMiddleware(action => {
    const { type, ...data } = action
    window.gtag('event', type, data)
  }, reducer)
}

export const trackedActions = {}

export function add(actionType, eventName, getPayload) {
  if (actionType in trackedActions) {
    console.warn(
      `Analytics: the action type "${actionType}" is already being tracked!`
    )
    return
  }
  trackedActions[actionType] = { actionType, eventName, getPayload }
}

export function isTrackable(action) {
  if (action && action.type) {
    return action.type in trackedActions
  }
  console.warn(`Analytics: invalid action "${JSON.stringify(action)}"`)
  return false
}

export function track(action) {
  if (window.analytics) {
    if (isTrackable(action)) {
      const { eventName, getPayload } = trackedActions[action.type]

      let event = action.type
      if (eventName) {
        switch (typeof eventName) {
          case 'string':
            event = eventName
            break
          case 'function':
            event = eventName(action)
            break
          default:
            console.warn(
              `Analytics: invalid argument "eventName" must be of type "string" or a "function" but got "${typeof eventName}" instead`
            )
        }
      }

      let payload
      if (getPayload) {
        if (typeof getPayload === 'function') {
          payload = getPayload(action)
        } else {
          console.warn(
            `Analytics: invalid argument "getPayload" must be of type "function" but got "${typeof getPayload}" instead`
          )
        }
      }

      window.analytics.track(event, payload)
    }
  }
}

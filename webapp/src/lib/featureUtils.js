import { env } from 'decentraland-commons'

/**
 * Returns true if the feature should be displayed
 * @param {string} - feature name
 * @returns {boolean}
 */
export function isFeatureEnabled(name) {
  return !!env.get(`REACT_APP_FF_${name.toUpperCase()}`)
}

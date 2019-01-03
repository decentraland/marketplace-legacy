import { env } from 'decentraland-commons'

const DEFAULT_WAIT_TIME = 10000 // 10 seconds
const waitTimeBetweenNewTilesRequest =
  parseInt(env.get('REACT_APP_WAIT_TIME_BETWEEN_NEW_TILES_REQUEST'), 10) ||
  DEFAULT_WAIT_TIME

let lastTimestamp = Date.now()

export function shouldRequestNewTilesFrom(timestamp) {
  const timeSinceLastRequest = timestamp - lastTimestamp

  const result = timeSinceLastRequest >= waitTimeBetweenNewTilesRequest
  lastTimestamp = timestamp

  return result
}

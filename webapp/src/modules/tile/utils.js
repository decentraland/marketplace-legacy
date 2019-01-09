import { env } from 'decentraland-commons'

const DEFAULT_WAIT_TIME = 10000 // 10 seconds
const waitTimeBetweenNewTilesRequest =
  parseInt(env.get('REACT_APP_WAIT_TIME_BETWEEN_NEW_TILES_REQUEST'), 10) ||
  DEFAULT_WAIT_TIME

export function shouldRequestNewTiles(lastRequestTimestamp, newTimestamp) {
  const timeSinceLastRequest = newTimestamp - lastRequestTimestamp
  return timeSinceLastRequest >= waitTimeBetweenNewTilesRequest
}

import { env } from 'decentraland-commons'

const waitTimeBetweenNewTilesRequest =
  parseInt(env.get('WAIT_TIME_BETWEE_NEW_TILES_REQUEST'), 10) || 10000 // 10 seconds

let lastTimestamp = Date.now()

export function shouldRequestNewTilesFrom(timestamp) {
  const timeSinceLastRequest = timestamp - lastTimestamp

  const result = timeSinceLastRequest >= waitTimeBetweenNewTilesRequest
  lastTimestamp = timestamp

  return result
}

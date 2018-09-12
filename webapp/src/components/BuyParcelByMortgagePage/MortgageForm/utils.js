import axios from 'axios'
import { env } from 'decentraland-commons'

const BASE_URL = env.get('REACT_APP_MORTGAGES_API')

export async function fetchMortgageData(x, y, duration) {
  const durationInSecs = new Date(duration).getTime()
  const response = await axios.get(
    `${BASE_URL}?x=${x}&y=${y}&duration=${durationInSecs}`
  )
  return response.data
}

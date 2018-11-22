import queryString from 'query-string'
import { createSelector } from 'reselect'
import { getLocation } from '@dapps/modules/location/selectors'

import { TOKEN_SYMBOLS } from './utils'

export const getState = state => state.auction
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getParams = state => getData(state).params
export const getCenter = state => getData(state).center
export const getParcelOnChainOwners = state =>
  getData(state).parcelOnChainOwners
export const getRates = state => getData(state).rate

export const getSelectedToken = createSelector(
  state => getLocation(state),
  location => {
    if (location) {
      const query = queryString.parse(location.search)
      if (query.token) {
        const selectedToken = TOKEN_SYMBOLS.find(
          symbol => symbol.toLowerCase() === query.token.toLowerCase()
        )
        if (selectedToken) {
          return selectedToken
        }
      }
    }
    return TOKEN_SYMBOLS[0] // 'MANA'
  }
)

export const getRate = createSelector(
  getSelectedToken,
  getRates,
  (selectedToken, rates) =>
    selectedToken in rates ? rates[selectedToken] : null
)

import { createSelector } from 'reselect'

import { FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST } from './actions'
import { isLoadingType } from 'modules/loading/selectors'
import { getAddress } from 'modules/wallet/selectors'
import { getParcels } from 'modules/parcels/selectors'
import { getActiveMortgagesByBorrower } from 'modules/mortgage/utils'
import { buildCoordinate } from 'lib/utils'

export const getState = state => state.mortgages
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getMortgages = state => getData(state).mortgages
export const isFetchingParcelMortgages = state =>
  isLoadingType(getLoading(state), FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST)

export const getMortgagesArray = createSelector(getMortgages, mortgages =>
  Object.keys(mortgages).map(key => mortgages[key])
)

export const getParcelMortgagesFactory = (x, y) =>
  createSelector(
    getAddress,
    getParcels,
    getMortgages,
    (userAddress, parcels, allMortgages) => {
      const parcel = parcels[buildCoordinate(x, y)]
      const mortgages =
        parcel && parcel.mortgages_tx_hashes
          ? parcel.mortgages_tx_hashes.map(tx => allMortgages[tx])
          : []
      return getActiveMortgagesByBorrower(mortgages, userAddress)
    }
  )

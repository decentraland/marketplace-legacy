import { createSelector } from 'reselect'

import {
  FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST,
  CREATE_MORTGAGE_REQUEST,
  PAY_MORTGAGE_REQUEST
} from './actions'
import { isLoadingType } from '@dapps/modules/loading/selectors'
import { getAddress } from 'modules/wallet/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getActiveMortgageByBorrower } from 'shared/mortgage'
import { buildCoordinate } from 'shared/coordinates'

export const getState = state => state.mortgage
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isFetchingParcelMortgages = (state, x, y) =>
  getLoading(state).some(
    action =>
      action.type === FETCH_ACTIVE_PARCEL_MORTGAGES_REQUEST &&
      action.x === x &&
      action.y === y
  )

export const isRequestingMortgageTransactionIdle = state =>
  isLoadingType(getLoading(state), CREATE_MORTGAGE_REQUEST)

export const isPayingMortgageTransactionIdle = state =>
  isLoadingType(getLoading(state), PAY_MORTGAGE_REQUEST)

export const getMortgagesArray = createSelector(getData, mortgages =>
  Object.values(mortgages)
)

export const getParcelMortgageFactory = (x, y) =>
  createSelector(
    getAddress,
    getParcels,
    getData,
    getPublications,
    (userAddress, parcels, allMortgages, publications) => {
      const parcel = parcels[buildCoordinate(x, y)]
      const mortgages =
        parcel && parcel.mortgages_tx_hashes
          ? parcel.mortgages_tx_hashes.map(tx => allMortgages[tx])
          : []

      return getActiveMortgageByBorrower(
        mortgages,
        parcels,
        publications,
        userAddress
      )
    }
  )

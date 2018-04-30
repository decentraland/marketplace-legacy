import {
  FETCH_PARCELS_REQUEST,
  FETCH_PARCELS_SUCCESS,
  FETCH_PARCELS_FAILURE,
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE
} from './actions'
import {
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS,
  PUBLISH_SUCCESS
} from 'modules/publication/actions'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import {
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_PARCEL_PUBLICATIONS_SUCCESS
} from 'modules/publication/actions'
import { FETCH_TRANSACTION_SUCCESS } from 'modules/transaction/actions'
import { loadingReducer } from 'modules/loading/reducer'
import { buildCoordinate } from 'lib/utils'
import { cleanParcel, toParcelObject } from './utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_REQUEST:
    case FETCH_PARCELS_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_PARCEL_SUCCESS: {
      const parcelId = action.parcel.id
      const parcel = state.data[parcelId]

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [parcelId]: cleanParcel(action.parcel, parcel)
        }
      }
    }
    case FETCH_PUBLICATIONS_SUCCESS:
    case FETCH_PARCELS_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case FETCH_PARCEL_FAILURE:
    case FETCH_PARCELS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ADDRESS_PARCELS_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...toParcelObject(action.parcels, state.data)
        }
      }
    }
    case EDIT_PARCEL_REQUEST: {
      const parcelId = action.parcel.id
      const parcel = state.data[parcelId]
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: { ...parcel }
        }
      }
    }
    case EDIT_PARCEL_SUCCESS:
    case EDIT_PARCEL_FAILURE: {
      const { parcel } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcel.id]: { ...parcel }
        }
      }
    }
    case FETCH_PARCEL_PUBLICATIONS_SUCCESS: {
      const { x, y, publications } = action
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: {
            ...parcel,
            publication_tx_hash_history: publications.map(
              publication => publication.tx_hash
            )
          }
        }
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.transaction

      switch (transaction.actionType) {
        case TRANSFER_PARCEL_SUCCESS: {
          const { x, y, newOwner } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          return {
            ...state,
            data: {
              ...state.data,
              [parcelId]: {
                ...state.data[parcelId],
                owner: newOwner.toLowerCase()
              }
            }
          }
        }
        case BUY_SUCCESS: {
          const owner = transaction.from
          const tx_hash = transaction.payload.tx_hash
          // unset publication_tx_hash and update owner
          return {
            ...state,
            data: Object.values(state.data).reduce((newParcels, parcel) => {
              if (parcel.publication_tx_hash === tx_hash) {
                newParcels[parcel.id] = {
                  ...parcel,
                  publication_tx_hash: null,
                  owner
                }
              } else {
                newParcels[parcel.id] = parcel
              }
              return newParcels
            }, {})
          }
        }
        case CANCEL_SALE_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash
          // unset publication_tx_hash
          return {
            ...state,
            data: Object.values(state.data).reduce((newParcels, parcel) => {
              if (parcel.publication_tx_hash === tx_hash) {
                newParcels[parcel.id] = {
                  ...parcel,
                  publication_tx_hash: null
                }
              } else {
                newParcels[parcel.id] = parcel
              }
              return newParcels
            }, {})
          }
        }
        case PUBLISH_SUCCESS: {
          // set publication_tx_hash
          const { x, y, tx_hash } = transaction.payload
          const parcelId = buildCoordinate(x, y)

          if (parcelId in state.data) {
            const parcel = state.data[parcelId]
            return {
              ...state,
              data: {
                ...state.data,
                [parcelId]: {
                  ...parcel,
                  publication_tx_hash: tx_hash,
                  publication_tx_hash_history: [
                    tx_hash,
                    ...(parcel.publication_tx_hash_history || [])
                  ]
                }
              }
            }
          }
          return state
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

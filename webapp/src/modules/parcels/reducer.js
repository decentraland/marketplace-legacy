import { loadingReducer } from '@dapps/modules/loading/reducer'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'

import {
  FETCH_PARCEL_REQUEST,
  FETCH_PARCEL_SUCCESS,
  FETCH_PARCEL_FAILURE,
  EDIT_PARCEL_REQUEST,
  EDIT_PARCEL_SUCCESS,
  EDIT_PARCEL_FAILURE,
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE
} from './actions'
import {
  MANAGE_ASSET_REQUEST,
  MANAGE_ASSET_SUCCESS,
  MANAGE_ASSET_FAILURE
} from 'modules/management/actions'
import {
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS,
  PUBLISH_SUCCESS,
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_ASSET_PUBLICATIONS_SUCCESS
} from 'modules/publication/actions'
import { FETCH_ADDRESS_PARCELS_SUCCESS } from 'modules/address/actions'
import {
  ADD_PARCELS,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_SUCCESS,
  CREATE_ESTATE_SUCCESS
} from 'modules/estates/actions'
import {
  FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS,
  FETCH_MORTGAGED_PARCELS_SUCCESS
} from 'modules/mortgage/actions'
import { BID_ON_PARCELS_SUCCESS } from 'modules/auction/actions'
import { getEstateIdFromTxReceipt } from 'modules/estates/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { ASSET_TYPES } from 'shared/asset'
import {
  normalizeParcel,
  toParcelObject,
  isParcel,
  isEqualCoords
} from 'shared/parcel'
import { buildCoordinate } from 'shared/coordinates'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function parcelsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PARCEL_REQUEST: {
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
          [parcelId]: normalizeParcel(action.parcel, parcel)
        }
      }
    }
    case FETCH_PUBLICATIONS_SUCCESS: {
      const { assets } = action
      const parcels = assets.filter(asset => isParcel(asset))
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...toParcelObject(parcels)
        }
      }
    }
    case FETCH_PARCEL_FAILURE: {
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
          ...action.parcels
        }
      }
    }
    case EDIT_PARCEL_REQUEST:
    case EDIT_PARCEL_FAILURE:
    case EDIT_PARCEL_SUCCESS:
    case MANAGE_ASSET_REQUEST:
    case MANAGE_ASSET_SUCCESS:
    case MANAGE_ASSET_FAILURE:
    case TRANSFER_PARCEL_REQUEST:
    case TRANSFER_PARCEL_SUCCESS:
    case TRANSFER_PARCEL_FAILURE: {
      const { asset_type } = action
      if (asset_type === ASSET_TYPES.parcel || !asset_type) {
        return {
          ...state,
          loading: loadingReducer(state.loading, action)
        }
      }
      return state
    }
    case FETCH_ASSET_PUBLICATIONS_SUCCESS: {
      const { id, assetType, publications } = action

      if (assetType === ASSET_TYPES.parcel) {
        const parcel = state.data[id]
        return {
          ...state,
          loading: loadingReducer(state.loading, action),
          data: {
            ...state.data,
            [id]: {
              ...parcel,
              publication_tx_hash_history: publications.map(
                publication => publication.tx_hash
              )
            }
          }
        }
      }
      return state
    }
    case FETCH_ACTIVE_PARCEL_MORTGAGES_SUCCESS: {
      const { x, y, mortgages } = action
      const parcelId = buildCoordinate(x, y)
      const parcel = state.data[parcelId]

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [parcelId]: {
            ...parcel,
            mortgages_tx_hashes: mortgages.map(mortgage => mortgage.tx_hash)
          }
        }
      }
    }
    case FETCH_MORTGAGED_PARCELS_SUCCESS: {
      const { mortgages } = action
      return {
        ...state,
        data: action.parcels.reduce((parcels, parcel) => {
          const parcelId = buildCoordinate(parcel.x, parcel.y)
          return {
            ...parcels,
            [parcelId]: {
              ...parcels[parcelId],
              ...parcel,
              mortgages_tx_hashes: mortgages
                .filter(
                  mortgage =>
                    mortgage.asset_type === ASSET_TYPES.parcel &&
                    mortgage.asset_id === parcelId
                )
                .map(mortgage => mortgage.tx_hash)
            }
          }
        }, state.data)
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const { transaction } = action.payload

      switch (transaction.actionType) {
        case EDIT_PARCEL_SUCCESS: {
          const { x, y, data } = transaction.payload
          const parcelId = buildCoordinate(x, y)

          return {
            ...state,
            data: {
              ...state.data,
              [parcelId]: {
                ...state.data[parcelId],
                data
              }
            }
          }
        }
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
        case BID_ON_PARCELS_SUCCESS: {
          const { xs, ys, beneficiary } = transaction.payload
          const owner = beneficiary.toLowerCase()

          return {
            ...state,
            data: xs.reduce(
              (data, x, index) => {
                const parcelId = buildCoordinate(x, ys[index])
                const parcel = { ...state.data[parcelId], owner }
                return { ...data, [parcelId]: parcel }
              },
              { ...state.data }
            )
          }
        }
        case BUY_SUCCESS: {
          // unset publication_tx_hash and update owner
          const owner = transaction.from
          const { type, x, y } = transaction.payload

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            const parcel = state.data[parcelId]
            return {
              ...state,
              data: {
                ...state.data,
                [parcelId]: {
                  ...parcel,
                  publication_tx_hash: null,
                  owner
                }
              }
            }
          }
          return state
        }
        case CANCEL_SALE_SUCCESS: {
          // unset publication_tx_hash
          const { type, x, y } = transaction.payload

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            const parcel = state.data[parcelId]
            return {
              ...state,
              data: {
                ...state.data,
                [parcelId]: {
                  ...parcel,
                  publication_tx_hash: null
                }
              }
            }
          }
          return state
        }
        case PUBLISH_SUCCESS: {
          // set publication_tx_hash
          const { type, x, y, tx_hash } = transaction.payload

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            const parcel = state.data[parcelId]
            if (parcel) {
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
          }
          return state
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { estate, parcels, type } = transaction.payload
          const updatedParcels = parcels.map(parcel => {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            return {
              ...state.data[parcelId],
              ...parcel,
              estate_id: type === ADD_PARCELS ? estate.id : null,
              owner:
                type === ADD_PARCELS
                  ? getContractAddress('EstateRegistry')
                  : transaction.from
            }
          })

          for (const parcel of estate.data.parcels) {
            const updatedParcel = updatedParcels.find(
              isEqualCoords.bind(parcel)
            )

            if (!updatedParcel) {
              const parcelId = buildCoordinate(parcel.x, parcel.y)
              const stateParcel = state.data[parcelId]
              if (stateParcel) {
                updatedParcels.push(stateParcel)
              }
            }
          }

          return {
            ...state,
            data: {
              ...state.data,
              ...toParcelObject(updatedParcels)
            }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          const updatedParcels = estate.data.parcels.map(parcel => {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            return {
              ...state.data[parcelId],
              estate_id: null,
              owner: transaction.from
            }
          })

          return {
            ...state,
            data: {
              ...state.data,
              ...toParcelObject(updatedParcels)
            }
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          const updatedParcels = estate.data.parcels.map(parcel => {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            return {
              ...state.data[parcelId],
              estate_id: estateId,
              owner: getContractAddress('EstateRegistry')
            }
          })

          return {
            ...state,
            data: {
              ...state.data,
              ...toParcelObject(updatedParcels)
            }
          }
        }
        default:
          return state
      }
    }
    default:
      return state
  }
}

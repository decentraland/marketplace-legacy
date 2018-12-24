import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'

import {
  FETCH_TILES_REQUEST,
  FETCH_TILES_SUCCESS,
  FETCH_TILES_FAILURE
} from './actions'
import {
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS,
  PUBLISH_SUCCESS
} from 'modules/publication/actions'
import {
  ADD_PARCELS,
  TRANSFER_ESTATE_SUCCESS,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_SUCCESS,
  CREATE_ESTATE_SUCCESS
} from 'modules/estates/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { getEstateIdFromTxReceipt } from 'modules/estates/utils'
import { ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'
import { shortenOwner } from 'shared/map'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function tileReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TILES_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_TILES_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          ...action.tiles
        }
      }
    }
    case FETCH_TILES_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const { transaction } = action.payload

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
                owner: shortenOwner(newOwner)
              }
            }
          }
        }
        case TRANSFER_ESTATE_SUCCESS: {
          const { estate, to } = transaction.payload

          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...state.data[estate.id],
                owner: shortenOwner(to)
              }
            }
          }
        }
        case BUY_SUCCESS: {
          const { type, id, x, y } = transaction.payload
          const owner = shortenOwner(transaction.from)
          const newData = {}

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            newData[parcelId] = {
              ...state.data[parcelId],
              price: null,
              owner
            }
          } else if (type === ASSET_TYPES.estate) {
            // TODO: @perf Super slow, there are a ton of tiles
            for (const tile of state.data) {
              if (tile.estate_id == id) {
                newData[tile.id] = {
                  ...tile,
                  price: null,
                  owner
                }
              }
            }
          }
          return {
            ...state,
            data: { ...state.data, ...newData }
          }
        }
        case CANCEL_SALE_SUCCESS: {
          const { type, id, x, y } = transaction.payload
          const newData = {}

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            newData[parcelId] = {
              ...state.data[parcelId],
              price: null
            }
          } else if (type === ASSET_TYPES.estate) {
            // TODO: @perf Super slow, there are a ton of tiles
            for (const tile of state.data) {
              if (tile.estate_id == id) {
                newData[tile.id] = { ...tile, price: null }
              }
            }
          }
          return {
            ...state,
            data: { ...state.data, ...newData }
          }
        }
        case PUBLISH_SUCCESS: {
          const { type, id, x, y } = transaction.payload
          const price = transaction.payload.price.toString()
          const newData = {}

          if (type === ASSET_TYPES.parcel) {
            const parcelId = buildCoordinate(x, y)
            newData[parcelId] = {
              ...state.data[parcelId],
              price
            }
          } else if (type === ASSET_TYPES.estate) {
            // TODO: @perf Super slow, there are a ton of tiles
            for (const tile of state.data) {
              if (tile.estate_id == id) {
                newData[tile.id] = { ...tile, price }
              }
            }
          }
          return {
            ...state,
            data: { ...state.data, ...newData }
          }
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { parcels, estate, type } = transaction.payload
          const newData = {}

          for (const parcel of parcels) {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            newData[parcelId] = {
              ...state.data[parcelId],
              estate_id: type === ADD_PARCELS ? estate.id : null
            }
          }

          return {
            ...state,
            data: { ...state.data, ...newData }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          const newData = {}

          for (const parcel of estate.data.parcels) {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            newData[parcelId] = {
              ...state.data[parcelId],
              estate_id: null
            }
          }

          return {
            ...state,
            data: { ...state.data, ...newData }
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          const newData = {}

          for (const parcel of estate.data.parcels) {
            const parcelId = buildCoordinate(parcel.x, parcel.y)
            newData[parcelId] = {
              ...state.data[parcelId],
              estate_id: estateId
            }
          }

          return {
            ...state,
            data: { ...state.data, ...newData }
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

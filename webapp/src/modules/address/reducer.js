import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'

import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_PARCELS_FAILURE,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_FAILURE,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_SUCCESS,
  FETCH_ADDRESS_PUBLICATIONS_FAILURE,
  FETCH_ADDRESS_ESTATES_REQUEST,
  FETCH_ADDRESS_ESTATES_SUCCESS,
  FETCH_ADDRESS_ESTATES_FAILURE,
  FETCH_ADDRESS_BIDS_REQUEST,
  FETCH_ADDRESS_BIDS_SUCCESS,
  FETCH_ADDRESS_BIDS_FAILURE
} from './actions'
import { toAddressParcelIds, toAddressPublicationIds } from './utils'
import { ASSET_TYPES } from 'shared/asset'
import { isParcel } from 'shared/parcel'
import { isEstate } from 'shared/estate'
import { buildCoordinate } from 'shared/coordinates'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/parcels/actions'
import { BUY_SUCCESS } from 'modules/publication/actions'
import {
  EDIT_ESTATE_PARCELS_SUCCESS,
  TRANSFER_ESTATE_SUCCESS,
  DELETE_ESTATE_SUCCESS,
  CREATE_ESTATE_SUCCESS,
  REMOVE_PARCELS
} from 'modules/estates/actions'
import {
  BID_SUCCESS,
  ACCEPT_BID_SUCCESS,
  CANCEL_BID_SUCCESS
} from 'modules/bid/actions'
import { getEstateIdFromTxReceipt } from 'modules/estates/utils'
import { getBidIdFromTxReceipt } from 'modules/bid/utils'

const EMPTY_ADDRESS = {
  contributions: [],
  parcel_ids: [],
  publication_ids: [],
  estate_ids: [],
  bid_ids: []
}

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function addressReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ADDRESS_PARCELS_REQUEST:
    case FETCH_ADDRESS_CONTRIBUTIONS_REQUEST:
    case FETCH_ADDRESS_PUBLICATIONS_REQUEST:
    case FETCH_ADDRESS_ESTATES_REQUEST:
    case FETCH_ADDRESS_BIDS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_ADDRESS_CONTRIBUTIONS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            contributions: action.contributions
          }
        }
      }
    case FETCH_ADDRESS_PARCELS_SUCCESS:
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            parcel_ids: Object.keys(action.parcels)
          }
        }
      }
    case FETCH_ADDRESS_ESTATES_SUCCESS: {
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...state.data[action.address],
            estate_ids: Object.keys(action.estates)
          }
        }
      }
    }
    case FETCH_ADDRESS_PUBLICATIONS_SUCCESS: {
      const addressData = state.data[action.address] || {}
      const { assets, publications } = action

      const parcel_ids = new Set([
        ...(addressData.parcel_ids || []),
        ...toAddressParcelIds(assets.filter(asset => isParcel(asset)))
      ])

      const estate_ids = new Set([
        ...(addressData.estate_ids || []),
        ...assets.filter(asset => isEstate(asset)).map(estate => estate.id)
      ])

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...addressData,
            publication_ids: toAddressPublicationIds(publications),
            parcel_ids: Array.from(parcel_ids),
            estate_ids: Array.from(estate_ids)
          }
        }
      }
    }
    case FETCH_ADDRESS_BIDS_SUCCESS: {
      const addressData = state.data[action.address] || {}
      const { bids } = action

      const parcel_ids = new Set([
        ...(addressData.parcel_ids || []),
        ...bids
          .filter(
            ({ asset_type, seller }) =>
              ASSET_TYPES.parcel === asset_type && seller === action.address
          )
          .map(({ asset_id }) => asset_id)
      ])

      const estate_ids = new Set([
        ...(addressData.estate_ids || []),
        ...bids
          .filter(
            ({ asset_type, seller }) =>
              ASSET_TYPES.estate === asset_type && seller === action.address
          )
          .map(({ asset_id }) => asset_id)
      ])

      const bid_ids = bids.map(({ id }) => id)

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [action.address]: {
            ...addressData,
            parcel_ids: Array.from(parcel_ids),
            estate_ids: Array.from(estate_ids),
            bid_ids
          }
        }
      }
    }
    case FETCH_ADDRESS_CONTRIBUTIONS_FAILURE:
    case FETCH_ADDRESS_PUBLICATIONS_FAILURE:
    case FETCH_ADDRESS_PARCELS_FAILURE:
    case FETCH_ADDRESS_ESTATES_FAILURE:
    case FETCH_ADDRESS_BIDS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    case FETCH_TRANSACTION_SUCCESS: {
      const transaction = action.payload.transaction

      switch (transaction.actionType) {
        case TRANSFER_PARCEL_SUCCESS: {
          const { oldOwner, newOwner, x, y } = transaction.payload
          const parcelId = buildCoordinate(x, y)
          const oldOwnerAddress = state.data[oldOwner] || { ...EMPTY_ADDRESS }
          const newOwnerAddress = state.data[newOwner] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [oldOwner]: {
                ...oldOwnerAddress,
                parcel_ids: oldOwnerAddress.parcel_ids.filter(
                  x => x !== parcelId
                )
              },
              [newOwner]: {
                ...newOwnerAddress,
                parcel_ids: newOwnerAddress.parcel_ids.concat(parcelId)
              }
            }
          }
        }
        case BUY_SUCCESS: {
          switch (transaction.payload.type) {
            case ASSET_TYPES.parcel: {
              const { x, y } = transaction.payload
              const parcelId = buildCoordinate(x, y)
              return {
                ...state,
                data: {
                  ...state.data,
                  [transaction.from]: {
                    ...state.data[transaction.from],
                    parcel_ids: [
                      ...state.data[transaction.from].parcel_ids,
                      parcelId
                    ]
                  }
                }
              }
            }
            case ASSET_TYPES.estate: {
              const { id } = transaction.payload
              return {
                ...state,
                data: {
                  ...state.data,
                  [transaction.from]: {
                    ...state.data[transaction.from],
                    estate_ids: [...state.data[transaction.from].estate_ids, id]
                  }
                }
              }
            }
            default:
              return state
          }
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { parcels, type } = transaction.payload
          const user = state.data[transaction.from]
          const parcelIds = user ? user.parcel_ids : []

          let updatedParcelIds = []

          if (type === REMOVE_PARCELS) {
            updatedParcelIds = [
              ...parcelIds,
              ...parcels.map(p => buildCoordinate(p.x, p.y))
            ]
          } else {
            updatedParcelIds = parcelIds.filter(
              parcelId =>
                !parcels.some(
                  estateParcel =>
                    buildCoordinate(estateParcel.x, estateParcel.y) === parcelId
                )
            )
          }

          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: updatedParcelIds
              }
            }
          }
        }
        case TRANSFER_ESTATE_SUCCESS: {
          const { estate, to } = transaction.payload
          const fromUser = state.data[transaction.from] || { ...EMPTY_ADDRESS }
          const toUser = state.data[to] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...fromUser,
                estate_ids: fromUser.estate_ids.filter(
                  estateId => estateId !== estate.id
                )
              },
              [to]: {
                ...toUser,
                estate_ids: [...toUser.estate_ids, estate.id]
              }
            }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          const user = state.data[transaction.from]
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: [
                  ...user.parcel_ids,
                  ...estate.data.parcels.map(parcel =>
                    buildCoordinate(parcel.x, parcel.y)
                  )
                ]
              }
            }
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          const user = state.data[transaction.from]
          const updatedParcelIds = user.parcel_ids.filter(
            parcelId =>
              !estate.data.parcels.some(
                estateParcel =>
                  buildCoordinate(estateParcel.x, estateParcel.y) === parcelId
              )
          )

          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                parcel_ids: updatedParcelIds,
                estate_ids: [...user.estate_ids, estateId]
              }
            }
          }
        }
        case BID_SUCCESS: {
          const { receipt } = transaction
          const bidId = getBidIdFromTxReceipt(receipt)
          const user = state.data[transaction.from] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                bid_ids: [...user.bid_ids, bidId]
              }
            }
          }
        }
        case ACCEPT_BID_SUCCESS: {
          const { bidId, bidder, type, id } = transaction.payload
          const fromUser = state.data[transaction.from] || { ...EMPTY_ADDRESS }
          const toUser = state.data[bidder] || { ...EMPTY_ADDRESS }

          let newFromUserData
          let newToUserData

          switch (type) {
            case ASSET_TYPES.parcel: {
              const parcelId = buildCoordinate(
                transaction.payload.x,
                transaction.payload.y
              )

              newFromUserData = {
                ...fromUser,
                parcel_ids: fromUser.parcel_ids.filter(id => id !== parcelId)
              }

              newToUserData = {
                ...toUser,
                parcel_ids: [...toUser.parcel_ids, parcelId]
              }
              break
            }
            case ASSET_TYPES.estate: {
              newFromUserData = {
                ...fromUser,
                estate_ids: fromUser.estate_ids.filter(
                  estateId => estateId !== id
                )
              }

              newToUserData = {
                ...toUser,
                estate_ids: [...toUser.estate_ids, id]
              }
              break
            }
          }
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...newFromUserData,
                bid_ids: fromUser.bid_ids.filter(id => id !== bidId)
              },
              [bidder]: {
                ...newToUserData,
                bid_ids: toUser.bid_ids.filter(id => id !== bidId)
              }
            }
          }
        }
        case CANCEL_BID_SUCCESS: {
          const { bidId } = transaction.payload
          const user = state.data[transaction.from] || { ...EMPTY_ADDRESS }
          return {
            ...state,
            data: {
              ...state.data,
              [transaction.from]: {
                ...user,
                bid_ids: user.bid_ids.filter(id => id !== bidId)
              }
            }
          }
        }
        default: {
          return state
        }
      }
    }
    default:
      return state
  }
}

import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'

import {
  BID_REQUEST,
  BID_SUCCESS,
  BID_FAILURE,
  FETCH_ASSET_BID_REQUEST,
  FETCH_ASSET_BID_SUCCESS,
  FETCH_ASSET_BID_FAILURE,
  CANCEL_BID_REQUEST,
  CANCEL_BID_SUCCESS,
  CANCEL_BID_FAILURE,
  FETCH_BID_REQUEST,
  FETCH_BID_SUCCESS,
  FETCH_BID_FAILURE,
  ACCEPT_BID_REQUEST,
  ACCEPT_BID_SUCCESS,
  ACCEPT_BID_FAILURE,
  FETCH_ASSET_ACCEPTED_BIDS_REQUEST,
  FETCH_ASSET_ACCEPTED_BIDS_SUCCESS,
  FETCH_ASSET_ACCEPTED_BIDS_FAILURE,
  ARCHIVE_BID,
  UNARCHIVE_BID
} from './actions'
import { getBidIdFromTxReceipt } from './utils'
import { LISTING_STATUS } from 'shared/listing'
import { ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'
import { FETCH_ADDRESS_BIDS_SUCCESS } from 'modules/address/actions'
import { getContractAddress } from 'modules/wallet/utils'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function bidReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ASSET_BID_REQUEST:
    case FETCH_ASSET_BID_FAILURE:
    case BID_REQUEST:
    case BID_FAILURE:
    case CANCEL_BID_REQUEST:
    case CANCEL_BID_FAILURE:
    case FETCH_BID_REQUEST:
    case FETCH_BID_FAILURE:
    case ACCEPT_BID_REQUEST:
    case ACCEPT_BID_FAILURE:
    case FETCH_ASSET_ACCEPTED_BIDS_REQUEST:
    case FETCH_ASSET_ACCEPTED_BIDS_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case ACCEPT_BID_SUCCESS:
    case CANCEL_BID_SUCCESS:
    case BID_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null
      }
    }
    case FETCH_ASSET_BID_SUCCESS:
    case FETCH_BID_SUCCESS: {
      const { bid } = action

      if (!bid) {
        return state
      }

      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [bid.id]: bid
        }
      }
    }
    case FETCH_ASSET_ACCEPTED_BIDS_SUCCESS:
    case FETCH_ADDRESS_BIDS_SUCCESS: {
      const { bids } = action
      const newData = bids.reduce(
        (stateBids, bid) => ({
          ...stateBids,
          [bid.id]: bid
        }),
        state.data
      )

      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: newData
      }
    }
    case ARCHIVE_BID: {
      // This flag is only used to re-render the components
      const { bidId } = action
      return {
        ...state,
        data: {
          ...state.data,
          [bidId]: { ...state.data[bidId], archived: true }
        }
      }
    }
    case UNARCHIVE_BID: {
      // This flag is only used to re-render the components
      const { bidId } = action
      return {
        ...state,
        data: {
          ...state.data,
          [bidId]: { ...state.data[bidId], archived: false }
        }
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const { transaction } = action.payload

      switch (transaction.actionType) {
        case BID_SUCCESS: {
          const { receipt } = transaction
          const bidId = getBidIdFromTxReceipt(receipt)
          const { price, bidder, expires_at, id, type } = transaction.payload

          let contractAddress
          let assetId
          switch (type) {
            case ASSET_TYPES.parcel: {
              assetId = buildCoordinate(
                transaction.payload.x,
                transaction.payload.y
              )
              contractAddress = getContractAddress('LANDRegistry')
              break
            }
            case ASSET_TYPES.estate: {
              assetId = id
              contractAddress = getContractAddress('EstateRegistry')
              break
            }
          }

          const newData = {}

          for (const bidId in state.data) {
            const bid = state.data[bidId]
            if (
              bid.token_address !== contractAddress ||
              bid.token_id !== id ||
              bid.bidder !== bidder
            ) {
              // Remove previous bid from the state when the users update it
              newData[bidId] = bid
            }
          }

          return {
            ...state,
            data: {
              ...newData,
              [bidId]: {
                id: bidId,
                token_address: contractAddress,
                token_id: id,
                asset_type: type,
                asset_id: assetId,
                bidder: bidder,
                status: LISTING_STATUS.open,
                expires_at,
                price
              }
            }
          }
        }
        case CANCEL_BID_SUCCESS: {
          const { bidId } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [bidId]: {
                ...state.data[bidId],
                status: LISTING_STATUS.cancelled
              }
            }
          }
        }
        case ACCEPT_BID_SUCCESS: {
          const { bidId } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [bidId]: {
                ...state.data[bidId],
                status: LISTING_STATUS.sold
              }
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

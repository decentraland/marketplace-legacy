import { utils } from 'decentraland-commons'
import {
  CREATE_ESTATE_REQUEST,
  CREATE_ESTATE_SUCCESS,
  CREATE_ESTATE_FAILURE,
  FETCH_ESTATE_REQUEST,
  FETCH_ESTATE_FAILURE,
  FETCH_ESTATE_SUCCESS,
  EDIT_ESTATE_METADATA_REQUEST,
  EDIT_ESTATE_METADATA_SUCCESS,
  EDIT_ESTATE_METADATA_FAILURE,
  EDIT_ESTATE_PARCELS_FAILURE,
  EDIT_ESTATE_PARCELS_REQUEST,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_REQUEST,
  DELETE_ESTATE_FAILURE,
  DELETE_ESTATE_SUCCESS,
  TRANSFER_ESTATE_REQUEST,
  TRANSFER_ESTATE_SUCCESS,
  TRANSFER_ESTATE_FAILURE
} from './actions'
import { loadingReducer } from '@dapps/modules/loading/reducer'
import { FETCH_ADDRESS_ESTATES_SUCCESS } from 'modules/address/actions'
import { FETCH_MAP_SUCCESS } from 'modules/map/actions'
import { FETCH_TRANSACTION_SUCCESS } from '@dapps/modules/transaction/actions'
import { getEstateIdFromTxReceipt } from './utils'
import { normalizeEstate, isEstate } from 'shared/estate'
import {
  BUY_SUCCESS,
  CANCEL_SALE_SUCCESS,
  PUBLISH_SUCCESS,
  FETCH_PUBLICATIONS_SUCCESS,
  FETCH_ASSET_PUBLICATIONS_SUCCESS
} from 'modules/publication/actions'
import { ASSET_TYPES } from 'shared/asset'

const INITIAL_STATE = {
  data: {},
  loading: [],
  error: null
}

export function estatesReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ESTATE_REQUEST:
    case CREATE_ESTATE_REQUEST:
    case CREATE_ESTATE_SUCCESS:
    case EDIT_ESTATE_PARCELS_REQUEST:
    case EDIT_ESTATE_PARCELS_SUCCESS:
    case EDIT_ESTATE_METADATA_REQUEST:
    case EDIT_ESTATE_METADATA_SUCCESS:
    case DELETE_ESTATE_REQUEST:
    case DELETE_ESTATE_SUCCESS:
    case TRANSFER_ESTATE_REQUEST:
    case TRANSFER_ESTATE_SUCCESS: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    }
    case FETCH_ESTATE_SUCCESS: {
      const { estate } = action
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [estate.id]: {
            ...normalizeEstate(estate)
          }
        }
      }
    }
    case FETCH_PUBLICATIONS_SUCCESS: {
      const { assets } = action
      const estates = assets.filter(asset => isEstate(asset))
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          ...estates.reduce((acc, estate) => {
            return { ...acc, [estate.id]: normalizeEstate(estate) }
          }, state.data)
        }
      }
    }
    case FETCH_ESTATE_FAILURE:
    case CREATE_ESTATE_FAILURE:
    case EDIT_ESTATE_PARCELS_FAILURE:
    case EDIT_ESTATE_METADATA_FAILURE:
    case DELETE_ESTATE_FAILURE:
    case TRANSFER_ESTATE_FAILURE: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    }
    case FETCH_ASSET_PUBLICATIONS_SUCCESS: {
      const { id, assetType, publications } = action

      if (assetType === ASSET_TYPES.estate) {
        const estate = state.data[id]
        if (estate) {
          return {
            ...state,
            loading: loadingReducer(state.loading, action),
            data: {
              ...state.data,
              [id]: {
                ...estate,
                publication_tx_hash_history: publications.map(
                  publication => publication.tx_hash
                )
              }
            }
          }
        }
      }
      return state
    }
    case FETCH_MAP_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.assets.estates
        }
      }
    }
    case FETCH_ADDRESS_ESTATES_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.estates
        }
      }
    }
    case FETCH_TRANSACTION_SUCCESS: {
      const { transaction } = action.payload

      switch (transaction.actionType) {
        case EDIT_ESTATE_METADATA_SUCCESS: {
          const { estate } = transaction.payload
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...state.data[estate.id],
                data: {
                  ...state.data[estate.id].data,
                  name: estate.data.name,
                  description: estate.data.description
                }
              }
            }
          }
        }
        case EDIT_ESTATE_PARCELS_SUCCESS: {
          const { estate } = transaction.payload
          const oldEstate = state.data[estate.id]
          return {
            ...state,
            data: {
              ...state.data,
              [estate.id]: {
                ...oldEstate,
                data: {
                  ...oldEstate.data,
                  parcels: estate.data.parcels
                }
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
                owner: to
              }
            }
          }
        }
        case DELETE_ESTATE_SUCCESS: {
          const { estate } = transaction.payload
          const data = utils.omit(state.data, estate.id)
          return {
            ...state,
            data
          }
        }
        case CREATE_ESTATE_SUCCESS: {
          const { receipt } = transaction
          const { estate } = transaction.payload
          const estateId = getEstateIdFromTxReceipt(receipt)
          return {
            ...state,
            data: {
              ...state.data,
              [estateId]: {
                ...estate,
                id: estateId,
                token_id: estateId,
                owner: transaction.from
              }
            }
          }
        }
        case BUY_SUCCESS: {
          const owner = transaction.from
          const tx_hash = transaction.payload.tx_hash
          if (transaction.payload.type === ASSET_TYPES.estate) {
            // unset publication_tx_hash and update owner
            return {
              ...state,
              data: Object.values(state.data).reduce((newEstates, estate) => {
                if (estate.publication_tx_hash === tx_hash) {
                  newEstates[estate.id] = {
                    ...estate,
                    publication_tx_hash: null,
                    owner
                  }
                } else {
                  newEstates[estate.id] = { ...estate }
                }
                return newEstates
              }, {})
            }
          }
          return state
        }
        case CANCEL_SALE_SUCCESS: {
          const tx_hash = transaction.payload.tx_hash
          if (transaction.payload.type === ASSET_TYPES.estate) {
            // unset publication_tx_hash
            return {
              ...state,
              data: Object.values(state.data).reduce((newEstates, estate) => {
                if (estate.publication_tx_hash === tx_hash) {
                  newEstates[estate.id] = {
                    ...estate,
                    publication_tx_hash: null
                  }
                } else {
                  newEstates[estate.id] = estate
                }
                return newEstates
              }, {})
            }
          }
          return state
        }
        case PUBLISH_SUCCESS: {
          // set publication_tx_hash
          const { type, id, tx_hash } = transaction.payload

          if (type === ASSET_TYPES.estate && id in state.data) {
            const estate = state.data[id]
            return {
              ...state,
              data: {
                ...state.data,
                [id]: {
                  ...estate,
                  publication_tx_hash: tx_hash,
                  publication_tx_hash_history: [
                    tx_hash,
                    ...(estate.publication_tx_hash_history || [])
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

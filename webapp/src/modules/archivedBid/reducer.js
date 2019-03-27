import { utils } from 'decentraland-commons'

import { ARCHIVE_BID, UNARCHIVE_BID } from './actions'

const INITIAL_STATE = {
  data: {}
}

export function archivedBidReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ARCHIVE_BID: {
      const { bid } = action
      return {
        data: {
          ...state.data,
          [bid.id]: Date.now()
        }
      }
    }
    case UNARCHIVE_BID: {
      const { bid } = action
      return {
        data: utils.omit(state.data, [bid.id])
      }
    }
    default:
      return state
  }
}

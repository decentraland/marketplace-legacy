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
          [bid.id]: true
        }
      }
    }
    case UNARCHIVE_BID: {
      const { bid } = action
      return {
        data: {
          ...state.data,
          [bid.id]: false
        }
      }
    }
    default:
      return state
  }
}

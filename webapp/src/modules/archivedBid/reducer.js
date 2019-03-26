import { ARCHIVE_BID, UNARCHIVE_BID } from './actions'

const INITIAL_STATE = {
  data: {}
}

export function archivedBidReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ARCHIVE_BID: {
      const { bidId } = action
      return {
        data: {
          ...state.data,
          [bidId]: true
        }
      }
    }
    case UNARCHIVE_BID: {
      const { bidId } = action
      return {
        data: {
          ...state.data,
          [bidId]: false
        }
      }
    }
    default:
      return state
  }
}

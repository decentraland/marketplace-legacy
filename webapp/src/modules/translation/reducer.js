import {
  CHANGE_LOCALE,
  FETCH_TRANSLATIONS_REQUEST,
  FETCH_TRANSLATIONS_SUCCESS,
  FETCH_TRANSLATIONS_FAILURE
} from './actions'
import { loadingReducer } from 'modules/loading/reducer'

const INITIAL_STATE = {
  data: {}, // { locale: translations }
  loading: [],
  error: null
}

export function translationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [action.locale]: null
        }
      }
    case FETCH_TRANSLATIONS_REQUEST:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case FETCH_TRANSLATIONS_SUCCESS:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        data: {
          ...state.data,
          [action.locale]: {
            ...action.translations
          }
        }
      }
    case FETCH_TRANSLATIONS_FAILURE:
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
        error: action.error
      }
    default:
      return state
  }
}

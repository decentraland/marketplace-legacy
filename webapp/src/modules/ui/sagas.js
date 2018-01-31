import { all } from 'redux-saga/effects'
import { mapSaga } from './map/sagas'

export function* uiSaga() {
  yield all([mapSaga()])
}

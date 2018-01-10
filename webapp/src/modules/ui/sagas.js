import { all } from 'redux-saga/effects'
import mapSaga from './map/sagas'

export default function* saga() {
  yield all([mapSaga()])
}

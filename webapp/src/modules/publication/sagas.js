import { call, takeEvery, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-commons'
import {
  FETCH_PUBLICATIONS_REQUEST,
  PUBLISH_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure,
  publishSuccess,
  publishFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'

export function* publicationSaga() {
  yield takeEvery(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
  yield takeEvery(PUBLISH_REQUEST, handlePublishRequest)
}

function* handlePublicationsRequest(action) {
  const { limit, offset, sortBy, sortOrder } = action
  try {
    const { publications, total } = yield call(() =>
      api.fetchPublications({ limit, offset, sortBy, sortOrder })
    )
    yield put(fetchPublicationsSuccess(publications, total))
  } catch (error) {
    yield put(fetchPublicationsFailure(error.message))
  }
}

function* handlePublishRequest(action) {
  try {
    // TODO: Use real contract method

    // const { x, y, price, expirationDate } = action.publication
    const marketplaceContract = eth.getContract('Marketplace')

    // const txHash = yield call(() =>
    //   marketplaceContract.publish(x, y, price, expirationDate)
    // )

    const mana = 0
    const manaTokenContract = eth.getContract('MANAToken')

    const txHash = yield call(() =>
      manaTokenContract.approve(marketplaceContract.address, mana)
    )

    const publication = {
      tx_hash: txHash,
      ...action.publication
    }

    yield put(publishSuccess(txHash, publication))
    yield put(push(locations.activity))
  } catch (error) {
    yield put(publishFailure(error.message))
  }
}

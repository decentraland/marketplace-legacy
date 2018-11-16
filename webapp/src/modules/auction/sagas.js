import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'

import {
  FETCH_AUCTION_PARAMS_REQUEST,
  BID_ON_PARCELS_REQUEST,
  fetchAuctionParamsSuccess,
  fetchAuctionParamsFailure,
  bidOnParcelsSuccess,
  bidOnParcelsFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'
import { getParams } from './selectors'

import { splitCoodinatePairs } from 'shared/coordinates'

const ONE_BILLION = 1000000000 // 1.000.000.000

export function* auctionSaga() {
  yield takeLatest(FETCH_AUCTION_PARAMS_REQUEST, handleAuctionParamsRequest)
  yield takeLatest(BID_ON_PARCELS_REQUEST, handleBidRequest)
}

function* handleAuctionParamsRequest(action) {
  try {
    const landAuction = eth.getContract('LANDAuction')

    const [
      availableParcelCount,
      gasPriceLimit,
      landsLimitPerBid,
      currentPrice
    ] = yield all([
      api.fetchAvaialableParcelCount(),
      landAuction.gasPriceLimit(),
      landAuction.landsLimitPerBid(),
      landAuction.getCurrentPrice()
    ])

    const params = {
      availableParcelCount,
      gasPriceLimit: gasPriceLimit.toNumber() / ONE_BILLION,
      landsLimitPerBid: landsLimitPerBid.toNumber(),
      currentPrice: eth.utils.fromWei(currentPrice)
    }

    yield put(fetchAuctionParamsSuccess(params))
  } catch (error) {
    yield put(fetchAuctionParamsFailure(error.message))
  }
}

function* handleBidRequest(action) {
  try {
    const { parcels, beneficiary } = action
    const { xs, ys } = splitCoodinatePairs(parcels)
    const landAuction = eth.getContract('LANDAuction')

    const { gasPriceLimit } = yield select(getParams)
    const gasPrice = gasPriceLimit * ONE_BILLION

    const txHash = yield call(() =>
      landAuction.bid(xs, ys, beneficiary, { gasPrice })
    )

    yield put(bidOnParcelsSuccess(txHash, xs, ys, beneficiary))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(bidOnParcelsFailure(error.message))
  }
}

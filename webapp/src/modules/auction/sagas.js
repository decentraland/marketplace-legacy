import { all, takeLatest, put, call } from 'redux-saga/effects'
import { eth } from 'decentraland-eth'

import {
  FETCH_AUCTION_PARAMS_REQUEST,
  BID_ON_PARCELS_REQUEST,
  fetchAuctionParamsSuccess,
  fetchAuctionParamsFailure,
  bidOnParcelsSuccess,
  bidOnParcelsFailure
} from './actions'
import { api } from 'lib/api'
import { splitCoodinatePairs } from 'shared/coordinates'

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
      gasPriceLimit: gasPriceLimit.toNumber(),
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

    const txHash = yield call(() => landAuction.bid(xs, ys, beneficiary))

    yield put(bidOnParcelsSuccess(txHash, parcels, beneficiary))
  } catch (error) {
    yield put(bidOnParcelsFailure(error.message))
  }
}

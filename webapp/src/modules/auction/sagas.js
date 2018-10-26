import { all, takeEvery, put } from 'redux-saga/effects'
import { eth } from 'decentraland-eth'

import {
  FETCH_AUCTION_PARAMS_REQUEST,
  fetchAuctionParamsSuccess,
  fetchAuctionParamsFailure
} from './actions'

export function* auctionSaga() {
  yield takeEvery(FETCH_AUCTION_PARAMS_REQUEST, handleAuctionParamsRequest)
}

function* handleAuctionParamsRequest(action) {
  try {
    console.log('eth.contracts', eth.contracts)
    const landAuction = eth.getContract('LANDAuction')

    const [gasPriceLimit, landsLimitPerBid, currentPrice] = yield all([
      landAuction.gasPriceLimit(),
      landAuction.landsLimitPerBid(),
      landAuction.getCurrentPrice()
    ])

    const params = {
      gasPriceLimit: gasPriceLimit.toNumber(),
      landsLimitPerBid: landsLimitPerBid.toNumber(),
      currentPrice: currentPrice.toNumber()
    }

    console.log('*********************************************')
    console.log({ params })
    console.log('*********************************************')

    yield put(fetchAuctionParamsSuccess(params))
  } catch (error) {
    yield put(fetchAuctionParamsFailure(error.message))
  }
}

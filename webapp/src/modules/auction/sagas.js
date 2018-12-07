import { takeLatest, put, call, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import { env } from 'decentraland-commons'
import { navigateTo } from '@dapps/modules/location/actions'

import { closeModal } from 'modules/ui/actions'
import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_RATE_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  BID_ON_PARCELS_REQUEST,
  fetchAuctionRateRequest,
  fetchAuctionRateSuccess,
  fetchAuctionRateFailure,
  fetchAuctionParamsSuccess,
  fetchAuctionParamsFailure,
  fetchAuctionPriceRequest,
  fetchAuctionPriceSuccess,
  fetchAuctionPriceFailure,
  bidOnParcelsSuccess,
  bidOnParcelsFailure,
  setSelectedCoordinates,
  FETCH_AUCTION_PRICE_REQUEST,
  FETCH_AUCTION_PRICE_SUCCESS
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'
import { splitCoodinatePairs } from 'shared/coordinates'
import { getParams, getRate, getSelectedToken, getPrice } from './selectors'
import { TOKEN_ADDRESSES } from './utils'

const ONE_BILLION = 1000000000 // 1.000.000.000

export function* auctionSaga() {
  yield takeLatest(FETCH_AUCTION_PARAMS_REQUEST, handleAuctionParamsRequest)
  yield takeLatest(FETCH_AUCTION_RATE_REQUEST, handleFetchAuctionRateRequest)
  yield takeLatest(FETCH_AUCTION_PRICE_REQUEST, handleFetchAuctionPriceRequest)
  yield takeLatest(BID_ON_PARCELS_REQUEST, handleBidRequest)
  yield takeLatest(
    FETCH_AUCTION_PARAMS_SUCCESS,
    handleFetchAuctionParamsSuccess
  )
  yield takeLatest(FETCH_AUCTION_PRICE_SUCCESS, handleFetchAuctionPriceSuccess)
}

function* handleAuctionParamsRequest(action) {
  try {
    const landAuction = eth.getContract('LANDAuction')
    const availableParcelCount = yield call(() =>
      api.fetchAvaialableParcelCount()
    )
    const gasPriceLimit = parseInt(
      env.get('REACT_APP_AUCTION_GAS_PRICE_LIMIT', 40),
      10
    )
    const landsLimitPerBid = parseInt(
      env.get('REACT_APP_AUCTION_LANDS_LIMIT_PER_BID', 40),
      10
    )
    const totalLandsBidded = yield call(() => landAuction.totalLandsBidded())
    const totalManaBurned = yield call(() => landAuction.totalManaBurned())
    const endTime = yield call(() => landAuction.endTime())

    const params = {
      availableParcelCount,
      gasPriceLimit,
      landsLimitPerBid,
      totalLandsBidded: totalLandsBidded,
      totalManaBurned: totalManaBurned.toNumber(),
      endTime: endTime.toNumber()
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

    const { currentPrice, gasPriceLimit } = yield select(getParams)
    const rate = yield select(getRate)
    const gasPrice = gasPriceLimit * ONE_BILLION

    const selectedToken = yield select(getSelectedToken)

    const txHash = yield call(() =>
      landAuction.bid(xs, ys, beneficiary, TOKEN_ADDRESSES[selectedToken], {
        gasPrice
      })
    )
    const params = { token: selectedToken, rate, currentPrice }

    yield put(bidOnParcelsSuccess(txHash, xs, ys, beneficiary, params))
    yield put(closeModal())
    yield put(setSelectedCoordinates({}))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(bidOnParcelsFailure(error.message))
  }
}

function* handleFetchAuctionRateRequest(action) {
  const { token } = action
  const selectedToken = yield select(getSelectedToken)
  if (selectedToken !== token) {
    yield put(navigateTo(locations.auction(token)))
  }
  try {
    const price = yield select(getPrice)
    const landAuction = eth.getContract('LANDAuction')

    let rate = 1
    if (TOKEN_ADDRESSES.MANA !== TOKEN_ADDRESSES[token]) {
      rate = eth.utils.fromWei(
        yield call(() =>
          landAuction.getRate(
            TOKEN_ADDRESSES.MANA,
            TOKEN_ADDRESSES[token],
            eth.utils.toWei(price)
          )
        )
      )
    }
    yield put(fetchAuctionRateSuccess(token, rate))
  } catch (error) {
    yield put(fetchAuctionRateFailure(token, error.message))
  }
}

function* handleFetchAuctionPriceRequest(action) {
  try {
    const landAuction = eth.getContract('LANDAuction')
    const currentPrice = yield call(landAuction.getCurrentPrice)
    const price = eth.utils.fromWei(currentPrice)
    yield put(fetchAuctionPriceSuccess(price))
  } catch (error) {
    yield put(fetchAuctionPriceFailure(error.message))
  }
}

function* handleFetchAuctionParamsSuccess(action) {
  yield put(fetchAuctionPriceRequest())
}

function* handleFetchAuctionPriceSuccess(action) {
  const token = yield select(getSelectedToken)
  yield put(fetchAuctionRateRequest(token))
}

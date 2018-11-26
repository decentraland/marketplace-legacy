import { delay } from 'redux-saga'
import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
import { CONNECT_WALLET_SUCCESS } from '@dapps/modules/wallet/actions'
import { isConnected } from '@dapps/modules/wallet/selectors'
import { navigateTo } from '@dapps/modules/location/actions'
import { getPathname } from '@dapps/modules/location/selectors'

import {
  FETCH_AUCTION_PARAMS_REQUEST,
  FETCH_AUCTION_RATE_REQUEST,
  FETCH_AUCTION_PARAMS_SUCCESS,
  BID_ON_PARCELS_REQUEST,
  fetchAuctionRateRequest,
  fetchAuctionRateSuccess,
  fetchAuctionRateFailure,
  fetchAuctionParamsRequest,
  fetchAuctionParamsSuccess,
  fetchAuctionParamsFailure,
  bidOnParcelsSuccess,
  bidOnParcelsFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'
import { splitCoodinatePairs } from 'shared/coordinates'
import { getParams, getSelectedToken } from './selectors'
import { TOKEN_ADDRESSES, hasAuctionFinished } from './utils'

const ONE_BILLION = 1000000000 // 1.000.000.000
const REFRESH_INTERVAL = 5000 // five segundos

export function* auctionSaga() {
  yield takeLatest(FETCH_AUCTION_PARAMS_REQUEST, handleAuctionParamsRequest)
  yield takeLatest(FETCH_AUCTION_RATE_REQUEST, handleFetchAuctionRateRequest)
  yield takeLatest(BID_ON_PARCELS_REQUEST, handleBidRequest)
  yield takeLatest(CONNECT_WALLET_SUCCESS, handleConnectWalletSuccess)
  yield takeLatest(FETCH_AUCTION_PARAMS_SUCCESS, handleFetchAuctionRateSuccess)
}

function* handleAuctionParamsRequest(action) {
  try {
    const landAuction = eth.getContract('LANDAuction')

    const [
      availableParcelCount,
      gasPriceLimit,
      landsLimitPerBid,
      currentPrice,
      landsBidded,
      totalManaBurned,
      startTime,
      endTime
    ] = yield all([
      api.fetchAvaialableParcelCount(),
      landAuction.gasPriceLimit(),
      landAuction.landsLimitPerBid(),
      landAuction.getCurrentPrice(),
      landAuction.landsBidded(),
      landAuction.totalManaBurned(),
      landAuction.startTime(),
      landAuction.endTime()
    ])

    const params = {
      availableParcelCount,
      gasPriceLimit: gasPriceLimit.toNumber() / ONE_BILLION,
      landsLimitPerBid: landsLimitPerBid.toNumber(),
      currentPrice: eth.utils.fromWei(currentPrice),
      landsBidded: landsBidded.toNumber(),
      totalManaBurned: totalManaBurned.toNumber(),
      startTime: startTime.toNumber(),
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

    const { gasPriceLimit } = yield select(getParams)
    const gasPrice = gasPriceLimit * ONE_BILLION

    const selectedToken = yield select(getSelectedToken)

    const txHash = yield call(() =>
      landAuction.bid(xs, ys, beneficiary, TOKEN_ADDRESSES[selectedToken], {
        gasPrice
      })
    )

    yield put(bidOnParcelsSuccess(txHash, xs, ys, beneficiary))
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
    const { currentPrice } = yield select(getParams)
    const landAuction = eth.getContract('LANDAuction')

    let rate = 1
    if (TOKEN_ADDRESSES.MANA !== TOKEN_ADDRESSES[selectedToken]) {
      rate = eth.utils.fromWei(
        yield call(() =>
          landAuction.getRate(
            TOKEN_ADDRESSES.MANA,
            TOKEN_ADDRESSES[selectedToken],
            eth.utils.toWei(currentPrice)
          )
        )
      )
    }
    yield put(fetchAuctionRateSuccess(selectedToken, rate))
  } catch (error) {
    yield put(fetchAuctionRateFailure(selectedToken, error.message))
  }
}

function* handleFetchAuctionRateSuccess(action) {
  const token = yield select(getSelectedToken)
  yield put(fetchAuctionRateRequest(token))
}

function* handleConnectWalletSuccess(action) {
  let connected = true
  // keep refreshing params and rate while the user is on /auction
  while (connected) {
    const pathname = yield select(getPathname)
    const hasFinished = yield call(() => hasAuctionFinished())
    if (pathname === locations.auction() && !hasFinished) {
      yield put(fetchAuctionParamsRequest())
    }
    yield delay(REFRESH_INTERVAL)
    connected = yield select(isConnected)
  }
}

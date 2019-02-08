import { takeLatest, call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'

import {
  BID_REQUEST,
  bidSuccess,
  bidFailure,
  CANCEL_BID_REQUEST,
  cancelBidSuccess,
  cancelBidFailure,
  ACCEPT_BID_REQUEST,
  acceptBidSuccess,
  acceptBidFailure,
  FETCH_ASSET_BID_REQUEST,
  fetchBidByAssetSuccess,
  fetchBidByAssetFailure,
  FETCH_BID_REQUEST,
  fetchBidByIdSuccess,
  fetchBidByIdFailure,
  FETCH_ASSET_ACCEPTED_BIDS_REQUEST,
  fetchAssetAcceptedBidsSuccess,
  fetchAssetAcceptedBidsFailure
} from './actions'
import { locations } from 'locations'
import { api } from 'lib/api'
import { ASSET_TYPES } from 'shared/asset'
import { LISTING_STATUS } from 'shared/listing'
import { getNFTAddressByType } from 'modules/asset/utils'
import { getContractAddress } from 'modules/wallet/utils'
import { getAddress } from 'modules/wallet/selectors'
import { buildAsset } from 'modules/asset/sagas'

export function* bidSagas() {
  yield takeLatest(BID_REQUEST, handlePlaceBid)
  yield takeLatest(CANCEL_BID_REQUEST, handleCancelBid)
  yield takeLatest(ACCEPT_BID_REQUEST, handleAcceptBid)
  yield takeLatest(FETCH_ASSET_BID_REQUEST, handleFetchBidByAsset)
  yield takeLatest(FETCH_BID_REQUEST, handleFetchBidById)
  yield takeLatest(
    FETCH_ASSET_ACCEPTED_BIDS_REQUEST,
    handleFetchAssetAcceptedBidsRequest
  )
}

function* handlePlaceBid({ bid }) {
  try {
    const { price, asset_type, asset_id, expires_at } = bid
    const priceInWei = eth.utils.toWei(price)
    const nftAddress = getNFTAddressByType(asset_type)
    const asset = yield buildAsset(asset_id, asset_type)

    const bidder = yield select(getAddress)

    let fingerprint = '0x'
    if (asset_type === ASSET_TYPES.estate) {
      const estateContract = eth.getContract('EstateRegistry')
      fingerprint = yield call(() => estateContract.getFingerprint(asset.id))
    }
    const expiresIn = Math.round((expires_at - Date.now()) / 1000)

    const bidContract = eth.getContract('ERC721Bid')

    const txHash = yield call(() =>
      bidContract.placeBid['address,uint256,uint256,uint256,bytes'](
        nftAddress,
        asset.id,
        priceInWei,
        expiresIn,
        fingerprint
      )
    )
    yield put(bidSuccess(txHash, { ...bid, bidder }, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(bidFailure(error.message))
  }
}

function* handleCancelBid({ bid }) {
  try {
    const { token_address, token_id, asset_id, asset_type } = bid
    const asset = yield buildAsset(asset_id, asset_type)

    const bidContract = eth.getContract('ERC721Bid')

    const txHash = yield call(() =>
      bidContract.cancelBid(token_address, token_id)
    )
    yield put(cancelBidSuccess(txHash, bid, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(cancelBidFailure(error.message))
  }
}

function* handleAcceptBid({ bid }) {
  try {
    const { id, token_id, asset_id, asset_type } = bid
    const erc721BidContractAddress = getContractAddress('ERC721Bid')
    const asset = yield buildAsset(asset_id, asset_type)

    const owner = yield select(getAddress)

    let contract
    if (asset_type === ASSET_TYPES.parcel) {
      contract = eth.getContract('LANDRegistry')
    } else {
      contract = eth.getContract('EstateRegistry')
    }

    const txHash = yield call(() =>
      contract.safeTransferFrom['address,address,uint256,bytes'](
        owner,
        erc721BidContractAddress,
        token_id,
        id
      )
    )
    yield put(acceptBidSuccess(txHash, { ...bid, seller: owner }, asset))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(acceptBidFailure(error.message))
  }
}

function* handleFetchBidById({ bidId }) {
  try {
    const bid = yield call(() => api.fetchBidById(bidId))
    yield put(fetchBidByIdSuccess(bid))
  } catch (error) {
    yield put(fetchBidByIdFailure(error.message))
  }
}

function* handleFetchBidByAsset({ assetId, assetType, status }) {
  try {
    const bidder = yield select(getAddress)

    const bids = yield call(() =>
      api.fetchBidsByAsset(assetId, { asset_type: assetType, bidder, status })
    )
    yield put(fetchBidByAssetSuccess(bids[0]))
  } catch (error) {
    yield put(fetchBidByAssetFailure(error.message))
  }
}

function* handleFetchAssetAcceptedBidsRequest({ asset }) {
  const { id, type } = asset
  try {
    const bids = yield call(() =>
      api.fetchBidsByAsset(id, {
        asset_type: type,
        status: LISTING_STATUS.sold
      })
    )
    yield put(fetchAssetAcceptedBidsSuccess(bids))
  } catch (error) {
    yield put(fetchAssetAcceptedBidsFailure(error.message))
  }
}

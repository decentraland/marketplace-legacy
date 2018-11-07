import { takeEvery, put, select, call, all } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'

import { locations } from 'locations'
import {
  CREATE_ESTATE_REQUEST,
  createEstateSuccess,
  createEstateFailure,
  FETCH_ESTATE_REQUEST,
  fetchEstateSuccess,
  fetchEstateFailure,
  EDIT_ESTATE_PARCELS_REQUEST,
  editEstateParcelsSuccess,
  editEstateParcelsFailure,
  EDIT_ESTATE_METADATA_REQUEST,
  editEstateMetadataSuccess,
  editEstateMetadataFailure,
  ADD_PARCELS,
  REMOVE_PARCELS,
  DELETE_ESTATE_REQUEST,
  deleteEstateSuccess,
  deleteEstateFailure,
  TRANSFER_ESTATE_REQUEST,
  transferEstateSuccess,
  transferEstateFailure
} from 'modules/estates/actions'
import { getEstates } from 'modules/estates/selectors'
import { getAddress } from 'modules/wallet/selectors'
import { api } from 'lib/api'
import { encodeMetadata } from 'shared/asset'
import { getParcelsNotIncluded } from 'shared/parcel'
import { splitCoodinatePairs } from 'shared/coordinates'
import { Bounds } from 'shared/map'

export function* estateSaga() {
  yield takeEvery(CREATE_ESTATE_REQUEST, handleCreateEstateRequest)
  yield takeEvery(EDIT_ESTATE_PARCELS_REQUEST, handleEditEstateParcelsRequest)
  yield takeEvery(FETCH_ESTATE_REQUEST, handleEstateRequest)
  yield takeEvery(EDIT_ESTATE_METADATA_REQUEST, handleEditEstateMetadataRequest)
  yield takeEvery(DELETE_ESTATE_REQUEST, handleDeleteEstate)
  yield takeEvery(TRANSFER_ESTATE_REQUEST, handleTransferRequest)
}

function* handleCreateEstateRequest(action) {
  const { estate } = action
  try {
    estate.data.parcels.forEach(({ x, y }) => Bounds.validateInBounds(x, y))

    const { x, y } = splitCoodinatePairs(estate.data.parcels)
    const metadata = {
      version: 0,
      name: estate.data.name,
      description: estate.data.description,
      ipns: ''
    }
    const data = yield call(() => encodeMetadata(metadata))
    const owner = yield select(getAddress)
    const land = eth.getContract('LANDRegistry')
    const txHash = yield call(() =>
      land.createEstateWithMetadata(x, y, owner, data)
    )
    yield put(createEstateSuccess(txHash, { ...estate, owner }))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(createEstateFailure(error.message))
  }
}

function* handleEditEstateParcelsRequest({ estate }) {
  const newParcels = estate.data.parcels
  try {
    newParcels.forEach(({ x, y }) => Bounds.validateInBounds(x, y))

    const estates = yield select(getEstates)
    const pristineEstate = estates[estate.id]
    const pristineParcels = pristineEstate.data.parcels

    const parcelsToAdd = getParcelsNotIncluded(newParcels, pristineParcels)
    const parcelsToRemove = getParcelsNotIncluded(pristineParcels, newParcels)

    const landRegistry = eth.getContract('LANDRegistry')
    const owner = yield select(getAddress)

    if (parcelsToAdd.length) {
      const { x, y } = splitCoodinatePairs(parcelsToAdd)

      const txHash = yield call(() =>
        landRegistry.transferManyLandToEstate(x, y, estate.id)
      )
      yield put(
        editEstateParcelsSuccess(txHash, estate, parcelsToAdd, ADD_PARCELS)
      )
    }

    if (parcelsToRemove.length) {
      const estateRegistry = eth.getContract('EstateRegistry')
      const landIds = yield all(
        parcelsToRemove.map(({ x, y }) => landRegistry.encodeTokenId(x, y))
      )
      const txHash = yield call(() =>
        estateRegistry.transferManyLands(estate.id, landIds, owner)
      )
      yield put(
        editEstateParcelsSuccess(
          txHash,
          estate,
          parcelsToRemove,
          REMOVE_PARCELS
        )
      )
    }

    yield put(push(locations.activity()))
  } catch (error) {
    yield put(editEstateParcelsFailure(error.message))
  }
}

function* handleEditEstateMetadataRequest({ estate }) {
  try {
    const estateRegistry = eth.getContract('EstateRegistry')
    const data = yield call(() => encodeMetadata(estate.data))
    const txHash = yield call(() =>
      estateRegistry.updateMetadata(estate.id, data)
    )
    yield put(editEstateMetadataSuccess(txHash, estate))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(editEstateMetadataFailure(error.message))
  }
}

function* handleEstateRequest(action) {
  try {
    const estate = yield call(() => api.fetchEstate(action.id))
    yield put(fetchEstateSuccess(estate))
  } catch (error) {
    yield put(fetchEstateFailure(error.message))
  }
}

function* handleDeleteEstate({ estateId }) {
  const landRegistry = eth.getContract('LANDRegistry')
  const estateRegistry = eth.getContract('EstateRegistry')
  try {
    const owner = yield select(getAddress)
    const estates = yield select(getEstates)
    const estate = estates[estateId]
    const parcelsToRemove = estate.data.parcels

    const landIds = yield all(
      parcelsToRemove.map(({ x, y }) => landRegistry.encodeTokenId(x, y))
    )
    const txHash = yield call(() =>
      estateRegistry.transferManyLands(estateId, landIds, owner)
    )
    yield put(deleteEstateSuccess(txHash, estate))
    yield put(push(locations.activity()))
  } catch (e) {
    yield put(deleteEstateFailure(e.message))
  }
}

function* handleTransferRequest({ estate, to }) {
  try {
    const oldOwner = yield select(getAddress)

    if (oldOwner.toLowerCase() === to.toLowerCase()) {
      throw new Error("You can't transfer estates to yourself")
    }

    if (!eth.utils.isValidAddress(to)) {
      throw new Error('Invalid Ethereum address')
    }

    if (!estate) {
      throw new Error('Invalid estate')
    } //@nacho TODO: on translations?

    const contract = eth.getContract('EstateRegistry')
    const txHash = yield call(() =>
      contract.safeTransferFrom(oldOwner, to, estate.id)
    )

    const transfer = {
      txHash,
      oldOwner,
      to,
      estate: {
        id: estate.id,
        data: {
          name: estate.data.name,
          parcels: estate.data.parcels // array of {x, y}
        }
      },
      id: estate.id
    }

    yield put(push(locations.activity()))
    yield put(transferEstateSuccess(txHash, transfer))
  } catch (error) {
    yield put(transferEstateFailure(error.message))
  }
}

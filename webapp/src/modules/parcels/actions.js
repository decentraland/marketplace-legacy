import { buildTransactionAction } from 'modules/transaction/utils'

// Edit Parcel

export const EDIT_PARCEL_REQUEST = '[Request] Edit Parcel'
export const EDIT_PARCEL_SUCCESS = '[Success] Edit Parcel'
export const EDIT_PARCEL_FAILURE = '[Failure] Edit Parcel'

export function editParcelRequest(parcel) {
  return {
    type: EDIT_PARCEL_REQUEST,
    parcel
  }
}

export function editParcelSuccess(txHash, parcel) {
  return {
    type: EDIT_PARCEL_SUCCESS,
    ...buildTransactionAction(txHash, {
      x: parcel.x,
      y: parcel.y,
      data: parcel.data
    }),
    parcel
  }
}

export function editParcelFailure(parcel, error) {
  return {
    type: EDIT_PARCEL_FAILURE,
    parcel,
    error
  }
}

// Fetch Parcel

export const FETCH_PARCEL_REQUEST = '[Request] Fetch Parcel'
export const FETCH_PARCEL_SUCCESS = '[Success] Fetch Parcel'
export const FETCH_PARCEL_FAILURE = '[Failure] Fetch Parcel'

export function fetchParcelRequest(x, y) {
  return {
    type: FETCH_PARCEL_REQUEST,
    x,
    y
  }
}

export function fetchParcelSuccess(x, y, parcel) {
  return {
    type: FETCH_PARCEL_SUCCESS,
    id: parcel.id,
    x,
    y,
    parcel
  }
}

export function fetchParcelFailure(x, y, error) {
  return {
    type: FETCH_PARCEL_FAILURE,
    x,
    y,
    error
  }
}

// Transfer Parcel

export const TRANSFER_PARCEL_REQUEST = '[Request] Parcel transfer'
export const TRANSFER_PARCEL_SUCCESS = '[Success] Parcel transfer'
export const TRANSFER_PARCEL_FAILURE = '[Failure] Parcel transfer'

export function transferParcelRequest(parcel, address) {
  return {
    type: TRANSFER_PARCEL_REQUEST,
    parcel,
    address
  }
}

export function transferParcelSuccess(txHash, transfer) {
  return {
    type: TRANSFER_PARCEL_SUCCESS,
    ...buildTransactionAction(txHash, {
      x: transfer.x,
      y: transfer.y,
      newOwner: transfer.newOwner,
      oldOwner: transfer.oldOwner
    }),
    transfer
  }
}

export function transferParcelFailure(error) {
  return {
    type: TRANSFER_PARCEL_FAILURE,
    error
  }
}

// Fetch available parcel

export const FETCH_AVAILABLE_PARCEL_REQUEST = '[Request] Fetch available parcel'
export const FETCH_AVAILABLE_PARCEL_SUCCESS = '[Success] Fetch available parcel'
export const FETCH_AVAILABLE_PARCEL_FAILURE = '[Failure] Fetch available parcel'

export function fetchAvailableParcelRequest() {
  return {
    type: FETCH_AVAILABLE_PARCEL_REQUEST
  }
}

export function fetchAvailableParcelSuccess(parcel) {
  return {
    type: FETCH_AVAILABLE_PARCEL_SUCCESS,
    parcel
  }
}

export function fetchAvailableParcelFailure(error) {
  return {
    type: FETCH_AVAILABLE_PARCEL_FAILURE,
    error
  }
}

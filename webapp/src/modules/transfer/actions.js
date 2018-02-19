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

export function transferParcelSuccess(transfer) {
  return {
    type: TRANSFER_PARCEL_SUCCESS,
    transfer
  }
}

export function transferParcelFailure(error) {
  return {
    type: TRANSFER_PARCEL_FAILURE,
    error
  }
}

// Clean Transfer

export const CLEAN_TRANSFER = 'Clean transfer data'

export function cleanTransfer() {
  return {
    type: CLEAN_TRANSFER
  }
}

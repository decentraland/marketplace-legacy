export const TRANSFER_PARCEL_REQUEST = '[Request] Parcel transfer requested'
export const TRANSFER_PARCEL_SUCCESS = '[Success] Parcel transfered'
export const TRANSFER_PARCEL_FAILURE = '[Failure] Failure to transfer parcel'

export const CLEAN_TRANSFER = 'Clean transfer data'

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

export function cleanTransfer() {
  return {
    type: CLEAN_TRANSFER
  }
}

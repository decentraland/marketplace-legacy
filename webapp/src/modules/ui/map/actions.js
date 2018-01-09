export const SELECT_PARCEL = 'Select Parcel'
export const CHANGE_RANGE = 'Change Range'

export function changeRange(nw, se) {
  return {
    type: CHANGE_RANGE,
    nw,
    se
  }
}

export function selectParcel(x, y) {
  return {
    type: SELECT_PARCEL,
    x,
    y
  }
}

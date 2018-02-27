// Select Parcel

export const SELECT_PARCEL = 'Select Parcel'

export function selectParcel(x, y) {
  return {
    type: SELECT_PARCEL,
    x,
    y
  }
}

// Change Range

export const CHANGE_RANGE = 'Change Range'

export function changeRange(center, nw, se) {
  return {
    type: CHANGE_RANGE,
    center,
    nw,
    se
  }
}

// Hover Parcel

export const HOVER_PARCEL = 'Hover Parcel'

export function hoverParcel(x, y) {
  return {
    type: HOVER_PARCEL,
    x,
    y
  }
}

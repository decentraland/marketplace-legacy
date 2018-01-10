export const COLOR_WON = '#4A90E2'
export const COLOR_WINNING = '#90B9E9'
export const COLOR_LOST = '#4F225F'
export const COLOR_OUTBID = '#F04ACC'
export const COLOR_TAKEN = '#39516B'
export const COLOR_GENESIS = '#FFFFFF'
export const COLOR_ROADS = '#5C5C5C'
export const COLOR_DISTRICT = '#B18AE0'
export const COLOR_PENDING = '#64D1B3'
export const COLOR_DEFAULT = '#EAEAEA'
export const COLOR_LOADING = '#AAAAAA'

export const COLORS = {
  littleValue: '#FFF189',
  bigValue: '#EF303B'
}

export const CLASS_NAMES = {
  won: 'won',
  winning: 'winning',
  lost: 'lost',
  outbid: 'outbid',
  taken: 'taken',
  genesis: 'genesis',
  district: 'district',
  roads: 'roads',
  default: 'default',
  pending: 'pending',
  loading: 'loading'
}

export function getClassName() {
  return CLASS_NAMES.default
}

export function getBidStatus() {
  return CLASS_NAMES.default
}

export function getBounds() {
  return {
    minX: -153,
    minY: -153,
    maxX: 153,
    maxY: 153
  }
}

export function getColor(parcel) {
  if (!parcel) {
    return COLOR_LOADING
  }
  if (parcel.district_id) {
    if (!parcel.district) {
      return COLOR_LOADING
    }
    if (parcel.district.name === 'Roads') {
      return COLOR_ROADS
    }
    if (parcel.district.name === 'Genesis Plaza') {
      return COLOR_GENESIS
    }
    return COLOR_DISTRICT
  }
  if (parcel.owned) {
    return COLOR_WON
  }
  return COLOR_DEFAULT
}

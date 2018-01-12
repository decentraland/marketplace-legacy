export const COLOR_MY_PARCELS = '#D98494' //'#4A90E2'
export const COLOR_DISTRICT = '#73C7E1' //'#FDF06F'
export const COLOR_DISTRICTS_CONTRIBUTED = '#4A90E2' //'#CD6FE7'
export const COLOR_ROADS = '#39516B' //'#35312E'
export const COLOR_PLAZA = '#FCFCFC' //'#F47E31'
export const COLOR_TAKEN = '#AEDC89' //'#9AC776' //'#B9F587' //'#F9F7E8'
export const COLOR_UNOWNED = '#F9F7E8'
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

export function getParcelAttributes(wallet, parcel, district) {
  if (!parcel) {
    return {
      label: 'Loading...',
      color: 'white',
      backgroundColor: COLOR_LOADING
    }
  }
  if (parcel.district_id) {
    if (!district) {
      return {
        label: 'Loading...',
        color: 'white',
        backgroundColor: COLOR_LOADING
      }
    }
    if (district.name === 'Roads') {
      return {
        label: 'Road',
        color: 'white',
        backgroundColor: COLOR_ROADS
      }
    }
    if (district.name === 'Genesis Plaza') {
      return {
        label: 'Genesis Plaza',
        color: 'black',
        backgroundColor: COLOR_PLAZA
      }
    }
    if (district.name === 'Embassy Town') {
      return {
        label: 'District',
        color: 'black',
        backgroundColor: COLOR_DISTRICTS_CONTRIBUTED
      }
    }
    return {
      label: 'District',
      color: 'black',
      backgroundColor: COLOR_DISTRICT
    }
  }

  if (wallet.parcels.some(p => p.id === parcel.id)) {
    return {
      label: 'Your Parcel',
      color: 'white',
      backgroundColor: COLOR_MY_PARCELS
    }
  }
  if (!parcel.price && !district) {
    return {
      label: 'No Owner',
      color: 'black',
      backgroundColor: COLOR_UNOWNED
    }
  }
  return {
    label: 'Taken',
    color: 'black',
    backgroundColor: COLOR_TAKEN
  }
}

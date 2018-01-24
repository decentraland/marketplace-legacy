import { shortenAddress } from 'lib/utils'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const colors = {
  MY_PARCELS: '#D98494',
  DISTRICT: '#73C7E1',
  DISTRICTS_CONTRIBUTED: '#4A90E2',
  ROADS: '#39516B',
  PLAZA: '#FCFCFC',
  TAKEN: '#AEDC89',
  UNOWNED: '#F9F7E8',
  LOADING: '#AAAAAA'
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

export function getBounds() {
  return {
    minX: -153,
    minY: -153,
    maxX: 153,
    maxY: 153
  }
}

export function isRoad(district_id) {
  return district_id === ROADS_ID
}

export function isPlaza(district_id) {
  return district_id === PLAZA_ID
}

export function isDistrict(district_id) {
  return !isRoad(district_id) && !isPlaza(district_id)
}

export function getParcelAttributes(wallet, parcel, district) {
  if (!parcel) {
    return {
      label: 'Loading...',
      color: 'black',
      backgroundColor: colors.LOADING
    }
  }
  if (parcel.district_id) {
    if (isRoad(parcel.district_id)) {
      return {
        label: 'Road',
        color: 'white',
        backgroundColor: colors.ROADS
      }
    }
    if (isPlaza(parcel.district_id)) {
      return {
        label: 'Genesis Plaza',
        color: 'black',
        backgroundColor: colors.PLAZA
      }
    }
    if (district && wallet.contributionsById[district.id]) {
      return {
        label: district ? district.name : 'District',
        color: 'black',
        backgroundColor: colors.DISTRICTS_CONTRIBUTED
      }
    }
    return {
      label: district ? district.name : 'District',
      color: 'black',
      backgroundColor: colors.DISTRICT
    }
  }

  if (wallet.parcelsById[parcel.id]) {
    return {
      label: parcel.name || 'Your Parcel',
      color: 'white',
      backgroundColor: colors.MY_PARCELS
    }
  }
  if (!parcel.owner && !district) {
    return {
      label: 'No Owner',
      color: 'black',
      backgroundColor: colors.UNOWNED
    }
  }

  return {
    label:
      parcel.name || parcel.owner
        ? 'Owner: ' + shortenAddress(parcel.owner)
        : 'No Name',
    color: 'black',
    backgroundColor: colors.TAKEN
  }
}

import { shortenAddress } from 'lib/utils'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const COLORS = Object.freeze({
  myParcels: '#D98494',
  district: '#73C7E1',
  contribution: '#4A90E2',
  roads: '#39516B',
  plaza: '#FCFCFC',
  taken: '#AEDC89',
  unowned: '#F9F7E8',
  loading: '#AAAAAA'
})

export function getBounds() {
  return {
    minX: -153,
    minY: -153,
    maxX: 153,
    maxY: 153
  }
}

export function inBounds(x, y) {
  const { minX, minY, maxX, maxY } = getBounds()
  return x >= minX && x <= maxX && y >= minY && y <= maxY
}

export function isRoad(district_id) {
  return district_id === ROADS_ID
}

export function isPlaza(district_id) {
  return district_id === PLAZA_ID
}

export function isDistrict(parcel) {
  return !!parcel.district_id
}

export function getDistrict(parcel, districts = {}) {
  return parcel && districts[parcel.district_id]
}

export function getParcelAttributes(wallet, parcel, districts) {
  if (!parcel) {
    return {
      label: 'Loading...',
      description: null,
      color: 'black',
      backgroundColor: COLORS.loading
    }
  }
  const district = getDistrict(parcel, districts)

  if (isDistrict(parcel)) {
    if (isRoad(parcel.district_id)) {
      return {
        label: 'Road',
        description: null,
        color: 'white',
        backgroundColor: COLORS.roads
      }
    }
    if (isPlaza(parcel.district_id)) {
      return {
        label: 'Genesis Plaza',
        description: null,
        color: 'black',
        backgroundColor: COLORS.plaza
      }
    }
    if (district && wallet.contributionsById[district.id]) {
      return {
        label: district ? district.name : 'District',
        description: null,
        color: 'black',
        backgroundColor: COLORS.contribution
      }
    }
    return {
      label: district ? district.name : 'District',
      description: null,
      color: 'black',
      backgroundColor: COLORS.district
    }
  }

  const label = parcel.data.name || null
  let description = 'No Owner'
  if (parcel.owner) {
    description =
      parcel.owner === wallet.address
        ? 'Your parcel'
        : `Owner: ${shortenAddress(parcel.owner)}`
  }

  if (wallet.parcelsById[parcel.id]) {
    return {
      label,
      description,
      color: 'white',
      backgroundColor: COLORS.myParcels
    }
  }
  if (!parcel.owner && !district) {
    return {
      label,
      description,
      color: 'black',
      backgroundColor: COLORS.unowned
    }
  }

  return {
    label,
    description,
    color: 'black',
    backgroundColor: COLORS.taken
  }
}

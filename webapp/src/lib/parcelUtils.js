import { shortenAddress } from 'lib/utils'
import { isOpen } from 'modules/publication/utils'
import { t } from 'modules/translation/utils'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const COLORS = Object.freeze({
  myParcels: '#ff9990',
  district: '#7773ff',
  contribution: '#4a27d4',
  roads: '#8188a3',
  plaza: '#80c290',
  taken: '#505772',
  onSale: '#00dbef',
  unowned: '#1b1e2d',
  background: '#0d0e18',
  loadingEven: '#131523',
  loadingOdd: '#181a29'
})

export const AUCTION_DATE = new Date('2018-01-31T00:00:00Z')

export function getBounds() {
  return {
    minX: -150,
    minY: -150,
    maxX: 150,
    maxY: 150
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

export function isOnSale(parcel) {
  return parcel != null && isOpen(parcel.publication)
}

export function getParcelAttributes(id, x, y, wallet, parcels, districts) {
  const parcel = parcels[id]
  if (!parcel) {
    return {
      label: t('atlas.loading') + '...',
      description: null,
      color: 'white',
      backgroundColor:
        (x + y) % 2 === 0 ? COLORS.loadingEven : COLORS.loadingOdd
    }
  }
  const district = getDistrict(parcel, districts)

  if (isDistrict(parcel)) {
    if (isRoad(parcel.district_id)) {
      return {
        label: t('atlas.road'),
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
        color: 'white',
        backgroundColor: COLORS.contribution
      }
    }
    return {
      label: district ? district.name : 'District',
      description: null,
      color: 'white',
      backgroundColor: COLORS.district
    }
  }

  const label = parcel.data.name || null
  let description = t('atlas.no_owner')
  if (parcel.owner) {
    description =
      parcel.owner === wallet.address
        ? t('atlas.your_parcel')
        : t('atlas.owner', { owner: shortenAddress(parcel.owner) })
  }

  if (wallet.parcelsById[parcel.id]) {
    return {
      label,
      description,
      color: 'black',
      backgroundColor: COLORS.myParcels
    }
  }
  if (!parcel.owner && !district) {
    return {
      label,
      description,
      color: 'white',
      backgroundColor: COLORS.unowned
    }
  }

  if (isOnSale(parcel)) {
    return {
      label,
      description,
      color: 'black',
      backgroundColor: COLORS.onSale
    }
  }

  return {
    label,
    description,
    color: 'white',
    backgroundColor: COLORS.taken
  }
}

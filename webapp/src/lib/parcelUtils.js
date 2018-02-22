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

export function drawMarker(
  ctx,
  x,
  y,
  scale = 2.5,
  fill = '#d1344e',
  stroke = '#970a09',
  width = 0.5
) {
  const upperRadious = 5 * scale
  const holeRadious = 2 * scale
  const lowerRadious = 1 * scale
  const height = 10 * scale
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.strokeWidth = width
  ctx.beginPath()
  const angle = Math.atan2(upperRadious, height)
  ctx.arc(x, y - height, upperRadious, angle, Math.PI - angle, true)
  ctx.lineTo(
    x - lowerRadious * Math.cos(angle),
    y - lowerRadious * Math.sin(angle)
  )
  ctx.arc(
    x,
    y - lowerRadious,
    lowerRadious,
    Math.PI - angle,
    2 * Math.PI + angle,
    true
  )
  ctx.lineTo(
    x + Math.cos(angle) * upperRadious,
    y - height + Math.sin(angle) * upperRadious
  )
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.moveTo(x + holeRadious, y - height)
  ctx.arc(x, y - height, holeRadious, 0, Math.PI * 2)
  ctx.fillStyle = '#970a09'
  ctx.fill()
  ctx.closePath()
}

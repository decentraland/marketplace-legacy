export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export function isRoad(district_id) {
  return district_id === ROADS_ID
}

export function isPlaza(district_id) {
  return district_id === PLAZA_ID
}

export function isDistrict(asset) {
  return !!asset.district_id
}

export function getDistrict(asset, districts = {}) {
  return asset && districts[asset.district_id]
}

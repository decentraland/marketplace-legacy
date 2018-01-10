export function toDistrictObject(districtsArray) {
  return districtsArray.reduce((map, district) => {
    map[district.id] = district
    return map
  }, {})
}

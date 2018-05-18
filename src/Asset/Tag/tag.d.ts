export interface Tag {
  proximity?: {
    plaza?: { district_id: string; distance: number }
    district?: { district_id: string; distance: number }
    road?: { district_id: string; distance: number }
  }
}

import { Model } from 'decentraland-commons'
import * as uuid from 'uuid'

export interface DistrictAttributes {
  id?: string
  name: string
  description: string
  link: string
  public: boolean
  parcel_count: number
  parcel_ids: string[]
  priority: number
  center: string
  disabled: boolean
  created_at?: Date
  updated_at?: Date
}

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export class District extends Model {
  static tableName = 'districts'
  static columnNames = [
    'id',
    'name',
    'description',
    'link',
    'public',
    'parcel_count',
    'parcel_ids',
    'priority',
    'center',
    'disabled'
  ]

  static isRoad(id: string): boolean {
    return ROADS_ID === id
  }

  static isPlaza(id: string): boolean {
    return PLAZA_ID === id
  }

  static findEnabled(): Promise<DistrictAttributes[]> {
    return this.find({ disabled: false })
  }

  static findByName(name): Promise<DistrictAttributes[]> {
    return this.findOne({ name })
  }

  static insert<T>(row: T): Promise<T>
  static insert(district: DistrictAttributes): Promise<DistrictAttributes> {
    district.id = district.id || uuid.v4()
    return super.insert(district)
  }
}

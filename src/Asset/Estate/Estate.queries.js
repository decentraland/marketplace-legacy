import { Parcel } from '../Parcel'
import { SQL, raw } from '../../database'
import { ASSET_TYPES } from '../../../shared/asset'

export const EstateQueries = Object.freeze({
  // prettier-ignore
  estateHasParcels: (tableRef) => 
    SQL`(${raw(tableRef)}.asset_type = ${ASSET_TYPES.estate}
    AND EXISTS(SELECT 1 FROM ${raw(Parcel.tableName)} AS p WHERE p.estate_id = ${raw(tableRef)}.asset_id)
    OR ${raw(tableRef)}.asset_type != ${ASSET_TYPES.estate})`
})

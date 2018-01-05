import React from 'react'
import Icon from 'components/Icon'
import CoordinateLink from '../CoordinateLink'

function ParcelRowData({ parcel, startEditing }) {
  return (
    <div className="table-row">
      <div className="col col-coord">
        <CoordinateLink parcel={parcel} />
      </div>
      <div className="col col-price">{parcel.price.toLocaleString()} MANA</div>
      <div className="col col-name">{parcel.name}</div>
      <div className="col col-actions" onClick={startEditing}>
        <Icon name="pencil" />
        Edit
      </div>
    </div>
  )
}

export default ParcelRowData

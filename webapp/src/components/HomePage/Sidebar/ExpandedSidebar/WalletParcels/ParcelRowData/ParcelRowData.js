import React from 'react'
import Icon from 'components/Icon'
import CoordinateLink from '../CoordinateLink'

class ParcelRowData extends React.PureComponent {
  getPrice() {
    const { parcel } = this.props
    return parcel.price ? `${parcel.price} MANA` : '--'
  }

  render() {
    const { parcel, onEdit } = this.props

    return (
      <div className="table-row">
        <div className="col col-coord">
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-price">{this.getPrice()}</div>
        <div className="col col-name">{parcel.name}</div>
        <div className="col col-actions" onClick={onEdit}>
          <Icon name="pencil" />
          Edit
        </div>
      </div>
    )
  }
}

export default ParcelRowData

import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'components/Icon'
import { parcelType } from 'components/types'

import CoordinateLink from '../CoordinateLink'

class ParcelRowData extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onEdit: PropTypes.func,
    onTransfer: PropTypes.func
  }

  getPrice() {
    const { parcel } = this.props
    return parcel.price ? `${parcel.price} MANA` : '--'
  }

  render() {
    const { parcel, onEdit, onTransfer } = this.props

    return (
      <div className="table-row">
        <div className="col col-coord">
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-price">{this.getPrice()}</div>
        <div className="col col-name">{parcel.data.name || '--'}</div>

        <div className="col col-actions">
          <span
            className="action"
            onClick={onEdit}
            data-balloon="Edit"
            data-balloon-pos="up"
          >
            <Icon name="pencil" />
          </span>
          <span
            className="action"
            onClick={onTransfer}
            data-balloon="Transfer"
            data-balloon-pos="up"
          >
            <Icon name="exchange" />
          </span>
        </div>
      </div>
    )
  }
}

export default ParcelRowData
